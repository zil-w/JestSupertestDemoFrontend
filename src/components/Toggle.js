import React, {useState, useImperativeHandle} from 'react'
import Button from './Button'

const Toggle = React.forwardRef((props, ref) => {
    const [toggled, setToggled] = useState(false)
    const showButtonVisibility = {display: (toggled ? 'none' : '')}
    const hideButtonVisibility = {display: (toggled ? '' : 'none')}

    const toggleVisibility = () => {
        setToggled(!toggled)
    }

    useImperativeHandle(ref, ()=>{//is return the function as an object obligatory?
    //yeah, it is
        return {toggleVisibility}
    })

    return(//what would happen if we apply styling to a component from outside of it? let's give it a try
    //well, turns out it does nothing, we have to wrap the component in div's
        <div>
            <div style = {showButtonVisibility}>
                <Button name = 'Add blog' action = {toggleVisibility} style={showButtonVisibility}/>
            </div>
            <div style = {hideButtonVisibility}>
                {props.children}
                <Button name = 'Cancel' action = {toggleVisibility}/>
            </div>
        </div>
    )
})

export default Toggle