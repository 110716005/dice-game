import { useMoralis } from 'react-moralis'
import { useState, useEffect } from 'react'
import Moralis from 'moralis'

function Header(props) {

    function truncate(address) {
        if (address !== "Connect Wallet") {
            return address.substr(0, 7) + "..." + address.substr(address.length - 5, 5)
        } else {
            return "Connect Wallet"
        }
    }

    return (
        <div className="bg-black w-full absolute z-10 inline-block">
            <div className="text-white inline-block font-bold w-fit p-2 ml-3 text-md sm:ml-5 sm:text-lg md:ml-7 md:text-xl lg:ml-10 lg:text-2xl">
                <p>Dice Game</p>
            </div>
            <div className="text-balck p-1 float-right mr-3 text-md sm:text-lg md:text-xl lg:text-2xl mt-1 sm:mr-5 md:mr-7 lg:mr-10 inline-block">
                <button className="bg-white rounded-xl px-2 font-bold" onClick={props.login}>{truncate(props.address)}</button>
            </div>
        </div>
    )
}

export default Header
