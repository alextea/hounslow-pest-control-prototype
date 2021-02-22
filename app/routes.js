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
module.exports = router
