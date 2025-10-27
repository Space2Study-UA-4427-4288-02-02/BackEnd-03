const Offer = require('~/models/offer')
const User = require('~/models/user')
const Subject = require('~/models/subject')
const logger = require('~/logger/logger')
const {
  roles: { TUTOR }
} = require('~/consts/auth')

const seedOffer = {
  createOffer: async () => {
    try {
      // Знаходимо користувача з роллю tutor
      const tutor = await User.findOne({ role: TUTOR })
      const subject = await Subject.findOne({ name: 'English' })
      if (!tutor) {
        logger.error('No tutor found in database')
        return null
      }

      const offersData = [
        {
          title: 'English for Beginners',
          price: 500,
          proficiencyLevel: 'Beginner',
          description: 'Perfect course for those who are just starting to learn English',
          languages: ['English', 'Ukrainian'],
          authorRole: 'tutor',
          author: tutor._id,
          category: subject.categoryId,
          subject: subject._id,
          status: 'active',
          FAQ: [
            {
              question: 'How long is one lesson?',
              answer: 'Each lesson is 60 minutes long'
            },
            {
              question: 'Do you provide materials?',
              answer: 'Yes, all materials are provided'
            }
          ]
        },
        {
          title: 'Advanced English Conversation',
          price: 800,
          proficiencyLevel: 'Advanced',
          description: 'Improve your conversational skills with native-like fluency',
          languages: ['English', 'Ukrainian'],
          authorRole: 'tutor',
          author: tutor._id,
          category: subject.categoryId,
          subject: subject._id,
          status: 'active',
          FAQ: [
            {
              question: 'What topics do we cover?',
              answer: 'We cover business, travel, culture, and current events'
            }
          ]
        },
        {
          title: 'Business English Professional',
          price: 1000,
          proficiencyLevel: 'Intermediate',
          description: 'Master business English for professional communication',
          languages: ['English'],
          authorRole: 'tutor',
          author: tutor._id,
          category: subject.categoryId,
          subject: subject._id,
          status: 'active',
          FAQ: [
            {
              question: 'Is this suitable for corporate training?',
              answer: 'Yes, perfect for professionals and corporate teams'
            }
          ]
        },
        {
          title: 'IELTS Preparation Course',
          price: 900,
          proficiencyLevel: 'Intermediate',
          description: 'Comprehensive IELTS exam preparation with proven strategies',
          languages: ['English', 'Ukrainian'],
          authorRole: 'tutor',
          author: tutor._id,
          category: subject.categoryId,
          subject: subject._id,
          status: 'active',
          FAQ: [
            {
              question: 'How long is the course?',
              answer: '3 months with intensive practice'
            },
            {
              question: 'Do you guarantee results?',
              answer: 'We provide strategies that helped students achieve 7+ scores'
            }
          ]
        }
      ]

      const createdOffers = []

      for (const offerData of offersData) {
        const existingOffer = await Offer.findOne({ title: offerData.title })
        if (existingOffer) {
          logger.info(`Offer "${offerData.title}" already exists`)
          createdOffers.push(existingOffer)
        } else {
          const offer = await Offer.create(offerData)
          logger.info(`Offer "${offerData.title}" created successfully`)
          createdOffers.push(offer)
        }
      }

      return createdOffers
    } catch (err) {
      logger.error('Error creating test offers:', err)
    }
  }
}

module.exports = seedOffer
