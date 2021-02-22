import React, { useState, useImperativeHandle } from 'react'
import propTypes from 'prop-types'
import Button from './Button'

const Toggle = React.forwardRef((props, ref) => {
  const [toggled, setToggled] = useState(false)
  const showButtonVisibility = { display: (toggled ? 'none' : '') }
  const hideButtonVisibility = { display: (toggled ? '' : 'none') }

  const toggleVisibility = () => {
    setToggled(!toggled)
  }

  useImperativeHandle(ref, () => {//is return the function as an object obligatory?
    //yeah, it is
    return { toggleVisibility }
  })

  return(//what would happen if we apply styling to a component from outside of it? let's give it a try
    //well, turns out it does nothing, we have to wrap the component in div's
    <>
      <div style = {showButtonVisibility}>
        <Button name = {props.showButtonName} action = {toggleVisibility}/>
      </div>
      <div style = {hideButtonVisibility}>
        <Button name = {props.hideButtonName} action = {toggleVisibility}/>
        {props.children}
      </div>
    </>
  )
})

Toggle.displayName = 'Toggle'

Toggle.propTypes = {
  showButtonName: propTypes.string.isRequired,
  hideButtonName: propTypes.string.isRequired
}

export default Toggle