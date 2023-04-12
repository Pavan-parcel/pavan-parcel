import React from 'react'
import { Link } from 'react-router-dom'

const SetItem = () => {
  return (
    <section className='setItem'>
        <div className='setitem_container'>
            <div className='row'>
                <div className='col-4'>
                    <div className="setitem_left">
                        <ul>
                            <li>
                                <Link> Items </Link>
                            </li>
                            <li>
                                <Link> Color </Link>
                            </li>
                            <li>
                                <Link> PLace To Send </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className='col-8'>
                    <div className="setitem_right">
                        <div className='d-flex justify-content-end'>

                        <div className="additem_form">
                            <form action="">
                            <input type="text" placeholder='Add Here' className='form_control' />
                            <button className='btn btn-primary'>Add</button>
                            </form>
                        </div>
                        </div>
                        <div className="additem_table">
                            <table cellPadding={0} cellSpacing={0}>
                                <tr>
                                    <th>No.</th>
                                    <th>Item</th>
                                </tr>
                                <tr>    
                                    <td>1</td>
                                    <td>Thelo</td>
                                </tr>
                                <tr>    
                                    <td>2</td>
                                    <td>Box</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default SetItem