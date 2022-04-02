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

    const connectWalletHandler = () => {
        if (window.ethereum) {
            window.ethereum.request({ method: 'eth_requestAccounts' }).then((result) => {
                accountChangedHandler(result[0])
            })
        } else {
            return (
                <div>Please install Metamask</div>
            )
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
        window.ethereum.on('accountsChanged', accountChangedHandler)
    }, [])

    if (!ethers.utils.isAddress(connButtonText)) {
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