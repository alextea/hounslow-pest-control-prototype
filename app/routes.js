const express = require('express')
const router = express.Router()

const pestData = require("./data/pests.json")

// Add your routes here - above the module.exports line

router.get('/type-of-pest', function (req, res) {
  let pestTypes = pestData.map(pest => {
    let obj = {}
    obj.value = pest['pest-type']
    obj.text = pest['title']
    return obj
  })

  pestTypes.splice(0, 1) // first index is a duplicate

  let additionalOptions = [
    {
      divider: 'or'
    },
    {
      value: 'unknown',
      text: 'I’m not sure'
    }
  ]

  pestTypes = pestTypes.concat(additionalOptions)

  res.render('type-of-pest', {
    'pestTypes': pestTypes
  })
})

router.post('/type-of-pest', function(req, res) {
  if (req.session.data['type_of_pest'] == "rats") {
    // additional questions
    res.redirect('/additional-questions-rats')
  } else if (req.session.data['type_of_pest'] == "fleas") {
    res.redirect('/additional-questions-fleas')
  } else if (req.session.data['type_of_pest'] == "bedbugs") {
    res.redirect('/additional-questions-bedbugs')
  } else {
    res.redirect('/about-your-home')
  }

})

router.get('/confirm-your-booking', function(req, res) {
  if (req.session.data['type_of_pest'] == 'unknown' || req.session.data['type_of_pest'] == 'pigeon') {
    res.redirect('/check-online-enquiry')
  }

  let pest = pestData.find(pest => {
    return  pest['pest-type'] == req.session.data['type_of_pest']
  })

  if (pest['pest-type'] == 'rats') {
    pest = pestData.find(pest => {
      return (pest['pest-type'] == req.session.data['type_of_pest'] && pest['location'] == req.session.data['pest_location'])
    })
  }

  let finalPrice = pest['price'];

  if (pest['pest-type'] == 'fleas' && req.session.data['number_rooms'] > 2) {
    let price = pest['price']
    finalPrice = price + ((req.session.data['number_rooms'] - 2) * 25)
  }

  if (pest['pest-type'] == 'bedbugs' && req.session.data['number_rooms'] > 2) {
    let price = pest['price']
    finalPrice = price + ((req.session.data['number_rooms'] - 2) * 55)
  }

  let formattedPrice = new Intl.NumberFormat("en-GB", {
    style: 'currency', currency: 'GBP'
  }).format(finalPrice)

  // 2021-02-08-am
  let timeSlotParts = req.session.data['time_slot'].split('-');
  let timeSlotDate = new Date(timeSlotParts[0], timeSlotParts[1]-1, timeSlotParts[2])
  let formattedTimeSlot = new Intl.DateTimeFormat("en-GB", {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  }).format(timeSlotDate)

  if (timeSlotParts[3] == "am") {
    formattedTimeSlot += " between 9am and 12 midday"
  } else {
    formattedTimeSlot += " between 1pm and 5pm"
  }

  res.render('confirm-your-booking', { pest: pest, price: formattedPrice, time_slot: formattedTimeSlot })
})

router.get('/confirmation', function (req, res) {
  let timeSlotParts = req.session.data['time_slot'].split('-');
  let timeSlotDate = new Date(timeSlotParts[0], timeSlotParts[1]-1, timeSlotParts[2])
  let formattedDate = new Intl.DateTimeFormat("en-GB", {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  }).format(timeSlotDate)

  let formattedTime = ""
  if (timeSlotParts[3] == "am") {
    formattedTime = "9am and 12 midday"
  } else {
    formattedTime = "1pm and 5pm"
  }

  res.render('confirmation', {
    formatted_date: formattedDate,
    formatted_time: formattedTime
  })
})

module.exports = router
