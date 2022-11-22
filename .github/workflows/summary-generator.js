const fs = require('fs')

const summaryFile = process.env.GITHUB_STEP_SUMMARY

async function writeToSummary(markdown) {
  await fs.writeFile(summaryFile, markdown, { flag: 'a' }, () => {
    console.log('Wrote to file.')
  })
}

const summaryData = {
  headings: ['Name', 'Favourite film', 'City'],
  entries: [
    ['Robin', 'Drive My Car', 'Paris'],
    ['Josh', 'The Lady Vanishes', 'London'],
    ['Niall', 'Interstellar', 'Newcastle'],
  ],
}

function convertToMarkdown({ headings, entries }) {
  const headingRow = headings.join(' | ')
  const splitRow = headings.map(() => '---').join(' | ')
  const entryRows = entries.map((entry) => entry.join(' | '))

  return [headingRow, splitRow, ...entryRows].join('\n')
}

writeToSummary(convertToMarkdown(summaryData))
