import { expect } from 'chai'
import path from 'path'
import fs from 'fs'

import minidotenv from '../lib'

jest.mock('fs')

describe('MiniDotenv', () => {
  it('should return a function', () => {
    const conf = minidotenv()

    expect(conf).to.be.instanceOf(Function)
  })


  it('should create distinct functions on initialization', () => {
    expect(minidotenv()).not.to.equal(minidotenv())
  })


  it('should return undefined for uknown key', () => {
    const conf = minidotenv()

    expect(conf('FOO')).to.be.undefined
  })


  it('should return string value for known key', () => {
    require('fs').__setMockFileContents(
      `${process.cwd()}/.env`,
      'FOO=BAR'
    )
    const conf = minidotenv()

    expect(conf('FOO')).to.equal('BAR')
  })


  it('should return number value for known key', () => {
    require('fs').__setMockFileContents(
      `${process.cwd()}/.env`,
      'FOO=123'
    )
    const conf = minidotenv()

    expect(conf('FOO')).to.equal(123)
  })


  it('should return number float value for known key', () => {
    require('fs').__setMockFileContents(
      `${process.cwd()}/.env`,
      'FOO=123.45'
    )
    const conf = minidotenv()

    expect(conf('FOO')).to.equal(123.45)
  })


  it('should return multiple values', () => {
    require('fs').__setMockFileContents(
      `${process.cwd()}/.env`,
      'FOO=BAR\nHELLO=WORLD'
    )
    const conf = minidotenv()

    expect(conf('FOO')).to.equal('BAR')
    expect(conf('HELLO')).to.equal('WORLD')
  })


  it('should treat undefined values as empty string', () => {
    require('fs').__setMockFileContents(
      `${process.cwd()}/.env`,
      'FOO='
    )
    const conf = minidotenv()

    expect(conf('FOO')).to.equal('')
  })


  it('should not add extra quotes to quoted text', () => {
    require('fs').__setMockFileContents(
      `${process.cwd()}/.env`,
      'FOO="BAR"'
    )
    const conf = minidotenv()

    expect(conf('FOO')).to.equal('BAR')
  })


  it('should not add extra quotes to single-quoted text', () => {
    require('fs').__setMockFileContents(
      `${process.cwd()}/.env`,
      "FOO='BAR'"
    )
    const conf = minidotenv()

    expect(conf('FOO')).to.equal('BAR')
  })


  it('should not attempt to convert complex values', () => {
    require('fs').__setMockFileContents(
      `${process.cwd()}/.env`,
      "FOO={'a': 1, 'b': 2}"
    )
    const conf = minidotenv()

    expect(conf('FOO')).to.equal("{a: 1, b: 2}")
  })


  it('should read value from given path to env file', () => {
    require('fs').__setMockFileContents(
      'path/to/.env',
      'FOO=BAR'
    )
    const conf = minidotenv({ path: 'path/to/.env' })

    expect(conf('FOO')).to.equal('BAR')
  })


  it('should silently fail if env file is not found', () => {
    require('fs').__setMockFileContents(
      'path/to/.env',
      'FOO=BAR'
    )
    const conf = minidotenv({ path: 'path/.env' })

    expect(conf('FOO')).to.be.undefined
  })


  it('should inject variables into system process.env ' +
    'object with inject option', () => {
    require('fs').__setMockFileContents(
      `${process.cwd()}/.env`,
      'FOO=BAR'
    )
    const conf = minidotenv({ inject: true })

    expect(process.env.FOO).to.equal('BAR')
  })


  it('should inject number variables as strings into ' +
     'system process.env object with inject option', () => {
    require('fs').__setMockFileContents(
      `${process.cwd()}/.env`,
      'FOO=BAR\nNUM=2'
    )
    const conf = minidotenv({ inject: true })

    expect(process.env.NUM).to.equal('2')
  })


  it('should inject variables into custom env ' +
    'object with inject option', () => {
    const customEnv: { [key:string]: string } = {}
    require('fs').__setMockFileContents(
      `${process.cwd()}/.env`,
      'FOO=BAR'
    )
    const conf = minidotenv({ inject: true, env: customEnv })

    expect(customEnv.FOO).to.equal('BAR')
  })


  it('should ignore comments', () => {
    require('fs').__setMockFileContents(
      `${process.cwd()}/.env`,
      'FOO=BAR\n# this is a comment\nHELLO=world'
    )
    const conf = minidotenv()

    expect(conf('FOO')).to.equal('BAR')
    expect(conf('#')).to.be.undefined
    expect(conf('HELLO')).to.equal('world')
  })
})

