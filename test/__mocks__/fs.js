const fs = jest.genMockFromModule('fs')

const fileContents = {}

fs.__setMockFileContents = (inPath, contents) => {
  fileContents[inPath] = contents
}

fs.readFileSync = (
  inPath,
  options = {},
  callback
) => {
  const contents = fileContents[inPath]

  if (!contents) {
    const err = new Error('ENOENT: no such file or directory')
    err.errno = -2
    err.syscall = 'open'
    err.code = 'ENOENT'
    throw err
    return
  }

  return contents
}

module.exports = fs

