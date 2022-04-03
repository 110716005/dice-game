import React from 'react'
import Header from './Header'
import { useMoralis } from 'react-moralis'
import { useState, useEffect } from 'react'
import Bet from './Bet'
import Footer from './Footer'
import { ethers } from 'ethers'
import { id } from 'ethers/lib/utils'

function App() {
    const [errorMessage, setErrorMessage] = useState()
    const [defaultAccount, setDefaultAccount] = useState()
    const [userBalance, setUserBalance] = useState()
    const [connButtonText, setConnButtonText] = useState("Connect Wallet")
    const [hasMetamask, setHasMetamask] = useState(1)

    const connectWalletHandler = () => {
        if (window.ethereum) {
            window.ethereum.request({ method: 'eth_requestAccounts' }).then((result) => {
                accountChangedHandler(result[0])
            })
        } else {
            
        }
    }

    const accountChangedHandler = (newAccount) => {
        setDefaultAccount(newAccount.toString())
        setConnButtonText(newAccount.toString())
        getUserBalance(newAccount.toString())
    }

    const getUserBalance = (address) => {
        window.ethereum.request({ method: 'eth_getBalance', params: [address, 'latest'] }).then((balance) => {
            setUserBalance(ethers.utils.formatEther(balance))
        })
    }

    useEffect(() => {
        if(window.ethereum){
            window.ethereum.on('accountsChanged', accountChangedHandler)
        }
    }, [])

    useEffect(() => {
        if(window.ethereum){
            setHasMetamask(1)
        }else{
            setHasMetamask(0)
        }
    })
    if(!hasMetamask){
        return (
            <div >
                <p className="mt-20 text-center border-2 border-rose-600 w-7/12 sm:w-6/12 md:w-5/12 lg:w-4/12 mx-auto">Please install Metamask</p>
            </div>
        )
    }
    if (!ethers.utils.isAddress(connButtonText) && hasMetamask) {
        return <Header login={connectWalletHandler} address={connButtonText} userBalance={userBalance}/>
    } else {
        return (
            <div>
                <Header login={connectWalletHandler} address={connButtonText} userBalance={userBalance}/>
                <Bet address={connButtonText} />
                <Footer />
            </div>
        )
    }
}

export default App