const express = require('express')
const router = express.Router()

const pestData = require("./data/pests.json")

// Add your routes here - above the module.exports line

router.get('/type-of-pest', function (req, res) {
  let pestTypes = [
    {
      value: 'rats',
      text: 'Rats'
    },
    {
      value: 'mice',
      text: 'Mice'
    },
    {
      value: 'squirrels',
      text: 'Squirrels'
    },
    {
      value: 'fleas',
      text: 'Fleas'
    },
    {
      value: 'cockroaches',
      text: 'Cockroaches'
    },
    {
      value: 'bedbugs',
      text: 'Bedbugs'
    },
    {
      value: 'pharaoh-ants',
      text: 'Pharaoh ants'
    },
    {
      value: 'garden-ants',
      text: 'Garden ants'
    },
    {
      value: 'wasps',
      text: 'Wasps'
    },
    {
      value: 'pigeons',
      text: 'Pigeons nesting in loft, etc'
    },
    {
      divider: 'or'
    },
    {
      value: 'unknown',
      text: 'I’m not sure'
    }
  ]

  res.render('type-of-pest', {
    'pestTypes': pestTypes
  })
})

module.exports = router
