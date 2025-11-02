const Subject = require('~/models/subject')
const Category = require('~/models/category')
const logger = require('~/logger/logger')

const seedSubject = {
  createSubject: async () => {
    try {
      const categoriesSubjects = [
        {
          categoryName: 'Mathematics',
          subjects: ['Algebra', 'Geometry', 'Integrals', 'Differential Equations']
        },
        {
          categoryName: 'Language',
          subjects: ['English', 'Ukrainian', 'German', 'French']
        },
        {
          categoryName: 'History',
          subjects: ['Ancient History', 'Medieval History', 'Modern History', 'World Wars']
        },
        {
          categoryName: 'Computer science',
          subjects: ['Operating Systems', 'Computer Networks', 'Artificial Intelligence', 'Cybersecurity']
        },
        {
          categoryName: 'Music',
          subjects: ['Music Theory', 'Solfeggio', 'Harmony', 'Composition']
        },
        {
          categoryName: 'Design',
          subjects: ['Graphic Design', 'UI/UX Design', 'Web Design', '3D Modeling']
        },
        {
          categoryName: 'Biology',
          subjects: ['Anatomy', 'Genetics', 'Ecology', 'Microbiology']
        },
        {
          categoryName: 'Painting',
          subjects: ['Watercolor', 'Oil Painting', 'Drawing', 'Sketching']
        },
        {
          categoryName: 'Finances',
          subjects: ['Financial Analysis', 'Investment', 'Banking', 'Corporate Finance']
        },
        {
          categoryName: 'Audit',
          subjects: ['Internal Audit', 'External Audit', 'Tax Audit', 'Risk Management']
        },
        {
          categoryName: 'Chemistry',
          subjects: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Analytical Chemistry']
        },
        {
          categoryName: 'Astronomy',
          subjects: ['Astrophysics', 'Planetary Science', 'Cosmology', 'Observational Astronomy']
        }
      ]

      const results = []

      for (const entry of categoriesSubjects) {
        const category = await Category.findOne({ name: entry.categoryName })
        if (!category) {
          logger.warn(`Category not found: ${entry.categoryName}`)
          continue
        }

        for (const subjName of entry.subjects) {
          const existingGlobal = await Subject.findOne({ name: subjName })
          if (existingGlobal) {
            logger.info(`Subject already exists globally, skipping: ${subjName}`)
            continue
          }

          const existing = await Subject.findOne({ name: subjName, categoryId: category._id })
          if (existing) {
            logger.info(`Subject already exists: ${subjName} (category: ${category.name})`)
            results.push(existing)
            continue
          }

          const created = await Subject.create({ name: subjName, categoryId: category._id })
          logger.info(`Subject created: ${created.name} (category: ${category.name})`)
          results.push(created)
        }
      }

      return results
    } catch (err) {
      logger.error('Error creating subjects:', err)
      return []
    }
  }
}

module.exports = seedSubject
