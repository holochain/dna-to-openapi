'use strict'

const fs = require('fs')
const path = require('path')
const childProcess = require('child_process')

const expect = require('chai').expect
const tmp = require('tmp')
tmp.setGracefulCleanup()

const version = require('../package').version

const TIMEOUT = 10000

function exec (...args) {
  return new Promise((resolve, reject) => {
    try {
      const here = path.resolve(__dirname)
      args.unshift(path.resolve(here, '../bin/dna-to-openapi'))
      args.unshift('node')
      childProcess.exec("'" + args.join("' '") + "'", {
        cwd: here,
        timeout: TIMEOUT
      }, (err, stdout, stderr) => {
        if (err) {
          return reject(new Error(JSON.stringify({
            err: err,
            stderr: stderr,
            stdout: stdout
          })))
        }
        resolve({ stdout, stderr })
      })
    } catch (e) {
      reject(e)
    }
  })
}

describe('dna-to-openapi commandline Suite', () => {
  it('-v should print version', async () => {
    const res = await exec('-v')
    expect(res.stdout).equals(version + '\n')
  }).timeout(TIMEOUT)

  it('should fail without dna', async () => {
    try {
      await exec()
    } catch (e) {
      return
    }
    throw new Error('expected throw, but did not')
  }).timeout(TIMEOUT)

  it('should lint w/o warnings or errors', async () => {
    const res = await exec('--path', '../test')
    expect(res.stderr).equals('')
  }).timeout(TIMEOUT)

  it('should generate spec', async () => {
    const tfile = tmp.tmpNameSync()
    await exec('--path', '../test', '--spec', tfile)
    const data = fs.readFileSync(tfile).toString()
    fs.unlinkSync(tfile)
    expect(data).contains('openapi').contains('3.0.0')
  }).timeout(TIMEOUT)

  it('should generate doc', async () => {
    const tfile = tmp.tmpNameSync()
    await exec('--path', '../test', '--doc', tfile)
    const data = fs.readFileSync(tfile).toString()
    fs.unlinkSync(tfile)
    expect(data).contains('openapi').contains('#swagger-ui')
  }).timeout(TIMEOUT)
})
