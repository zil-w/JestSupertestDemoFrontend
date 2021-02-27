import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogSubForm from './BlogSubForm'

describe('Testing the blog submission form', () => {
  let submissionForm
  const mockSubmitter = jest.fn()

  beforeEach(() => {
    submissionForm = render(<BlogSubForm formSubHandler={mockSubmitter} />)
    //submissionForm.debug()
  })

  test('Check if the form submits with the right info', () => {
    const blogURL = 'testing.com'
    const blogOwner = 'john doe'
    const blogTitle = 'testing blog'

    const inputURL = submissionForm.container.querySelector('#Title')
    const inputOwner = submissionForm.container.querySelector('#Blog_URL')
    const inputTitle = submissionForm.container.querySelector('#Blog_Author')
    const form = submissionForm.container.querySelector('form')

    fireEvent.change(inputURL, { target: { value: blogURL } })
    fireEvent.change(inputOwner, { target: { value: blogOwner } })
    fireEvent.change(inputTitle, { target: { value: blogTitle } })
    fireEvent.submit(form)

    expect(mockSubmitter.mock.calls).toHaveLength(1)
    //it seems like the order is in the way that you changed them
    expect(mockSubmitter.mock.calls[0][0]).toBe(blogURL)
    expect(mockSubmitter.mock.calls[0][1]).toBe(blogOwner)
    expect(mockSubmitter.mock.calls[0][2]).toBe(blogTitle)
  })
})