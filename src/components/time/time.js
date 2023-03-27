import React from 'react'
import './time.sass'

const Time = () => {
  return (
    <section className='pt__time'>
        <div className='container'>
            <div className='row'>
                 <div className='col-12'>
                    <div className='pt__time_inner'>
                        <div className='pt__lr_num time_btn'>LR Number :  25</div>
                        <div className='pt__lr_time time_btn'>Wednesday, March 8, 2023 2:48:58 PM</div>
                        <a className='pt__lr_item time_btn' href='#'> 
                        Add More Items 
                        </a>
                    </div>
                 </div>
            </div>
        </div>
    </section>
  )
}

export default Time