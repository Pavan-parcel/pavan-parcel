import React from 'react'
import './time.sass'
import moment from 'moment'
import { useEffect } from 'react'
import { async } from 'q'
import supabase from '../../supabase/supabaseClient'
import { useState } from 'react'

const Time = () => {

  const [LR, setLR] = useState(0);

  useEffect(() => {
    getFormCount();
  }, [])

  async function getFormCount(){
    const {data, error} = await supabase.from('forms').select("*");
    if(!error){
      setLR(data[0]?.form_no)
    }
  }

  return (
    <section className='pt__time'>
        <div className='container'>
            <div className='row'>
                 <div className='col-12'>
                    <div className='pt__time_inner'>
                        <div className='pt__lr_num time_btn'>LR Number :  {LR}</div>
                        <div className='pt__lr_time time_btn'>{moment(new Date()).format('dddd, MMMM Do YYYY, h:mm:ss a')}</div>
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