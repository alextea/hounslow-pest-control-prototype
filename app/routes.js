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
  console.log(pestTypes)

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
  console.log(req.session.data['type_of_pest'])
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
  let pest = pestData.find(pest => {
    return  pest['pest-type'] == req.session.data['type_of_pest']
  })

  if (pest['pest-type'] == 'rats') {
    pest = pestData.find(pest => {
      console.log(req.session.data['type_of_pest'], pest['pest-type'])
      console.log(req.session.data['pest_location'], pest['location'])
      return (pest['pest-type'] == req.session.data['type_of_pest'] && pest['location'] == req.session.data['pest_location'])
    })
  }

  let finalPrice = pest['price'];

  if (pest['pest-type'] == 'fleas') {
    let price = pest['price']
    finalPrice = price + (req.session.data['number_rooms'] * 25)
  }

  if (pest['pest-type'] == 'bedbugs') {
    let price = pest['price']
    finalPrice = price + (req.session.data['number_rooms'] * 55)
  }

  let formattedPrice = new Intl.NumberFormat("en-GB", {
    style: 'currency', currency: 'GBP'
  }).format(finalPrice)

  // 2021-02-08-am
  let timeSlotParts = req.session.data['time_slot'].split('-');
  let timeSlotDate = new Date(timeSlotParts[0], timeSlotParts[1], timeSlotParts[2])
  let formattedTimeSlot = new Intl.DateTimeFormat("en-GB", {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  }).format(timeSlotDate)

  if (timeSlotParts[3] == "am") {
    formattedTimeSlot += " 9am to 12 midday"
  } else {
    formattedTimeSlot += " 1pm to 5pm"
  }

  res.render('confirm-your-booking', { pest: pest, price: formattedPrice, time_slot: formattedTimeSlot })
})

module.exports = router
