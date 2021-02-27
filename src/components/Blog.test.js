import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('Testing the blog component', () => {

  let testingBlog
  const mockBlogUpdater = jest.fn()
  const mockBlogDeleter = jest.fn()

  beforeEach(() => {
    const blogObj = {
      title: 'testing blog',
      author: 'ghangis swan',
      url: 'testingblog.com',
      likes: 0
    }

    testingBlog = render(<Blog blog={blogObj} blogUpdate={mockBlogUpdater} blogDelete={mockBlogDeleter} />)
  })

  test('Testing a blog\'s default display content', () => {
    expect(testingBlog.container).toHaveTextContent(
      'testing blog'
    )
    expect(testingBlog.container).toHaveTextContent(
      'ghangis swan'
    )

    const div = testingBlog.container.querySelector('.conditionally_displayed')
    expect(div).toHaveStyle('display: none')
  })

  test('When show button is clicked, the url and number of likes are shown', () => {
    const button = testingBlog.getByText('Show')
    fireEvent.click(button)
    const div = testingBlog.container.querySelector('.conditionally_displayed')
    expect(div).not.toHaveStyle('display: none')
  })

  test('When like button is clicked twice, the like handler is called twice', () => {
    const button = testingBlog.getByText('like')
    fireEvent.click(button)
    fireEvent.click(button)
    expect(mockBlogUpdater.mock.calls).toHaveLength(2)
  })
})