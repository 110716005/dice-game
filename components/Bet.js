import Image from 'next/image'
import { useState, useEffect } from 'react'
import data from '.././build/contracts/Dice.json'
import Web3 from "web3"
import { useMoralis } from 'react-moralis'

function Bet(props) {
    const [target, setTarget] = useState('0')
    const [betAmount, setBetAmount] = useState(0)
    const [lock, setLock] = useState(false)
    const [currentBet, setCurrentBet] = useState()
    const [chainId, setChainId] = useState()
    const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
    const DiceGame = new web3.eth.Contract(data.abi, "0x58Fae9B7Fd421b0871C64E3f4b5Cd80FE31B9d3A")
    const [isVisible, setIsVisible] = useState(false)

    function createBet() {
        DiceGame.methods.getNewBet(target).send({ from: props.address, value: betAmount * 10 ** 18 }).then(function (receipt) {
            console.log(receipt)
        })
    }

    function roll() {
        DiceGame.methods.roll().send({ from: props.address }).on('receipt', function (receipt) {
            if (receipt.events.GameResult.returnValues[1] == receipt.events.GameResult.returnValues[2])
                alert("Your bet : " + receipt.events.GameResult.returnValues[1] + "    " + "Destiny : " + receipt.events.GameResult.returnValues[2] + " \nYou win!!")
            else {
                alert("Your bet : " + receipt.events.GameResult.returnValues[1] + "    " + "Destiny : " + receipt.events.GameResult.returnValues[2] + " \nYou lose!!")
            }
        })
    }

    function isBetSet() {
        DiceGame.methods.isBetSet().call({ from: props.address }).then(function (result) {
            setLock(result)
            console.log(result)
            if (result) {
                betOf()
            } else {
                setCurrentBet(0)
            }
        })
    }

    function betOf() {
        return DiceGame.methods.betOf(props.address).call().then(function (result) {
            setCurrentBet(result)
        })
    }
    async function detectChainId() {
        const temp = await ethereum.request({ method: 'eth_chainId' })
        setChainId(temp)
    }

    useEffect(() => {
        detectChainId()
        ethereum.on('chainChanged', (_chainId) => {
            setChainId(_chainId)
            window.location.reload();
        });
    }, [])

    useEffect(() => {
        if (chainId != "0x4") {
            setIsVisible(true)
            window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x4' }], // chainId must be in hexadecimal numbers
            });
        }else{
            setIsVisible(false)
        }
    }, [chainId])

    /* BUG : 當還在執行isBetset()時，切換網路會造成資料讀取出錯*/

    useEffect(() => {
        if (chainId == "0x4") {
            const interval = setInterval(() => {
                try{
                    isBetSet()
                }catch(error){
                    console.log(error)
                }
            }, 3000);

            return () => {
                clearInterval(interval)
            }
        }
    }, [props.address, chainId])

    return (
        <div>
            <div className="z-10 absolute w-full mt-20">
                <div>
                    <div className="text-center">
                        <span className={"bg-red-500 px-8 py-3 rounded-xl z-1 " + (isVisible ? "visble" : "invisible")}>Your wallet is connected to the wrong network.Please switch to main network</span>
                    </div>
                    
                    <div className="z-50 mt-20 bg-black w-5/12 lg:w-3/12 mx-auto h-4/6 text-white text-center text-md sm:text-xl md:text-2xl lg:text-3xl opacity-30 rounded-xl py-5">
                        Your current bet : <span>{currentBet}</span>
                    </div>
                </div>
                <div className="mt-5 text-center text-md sm:text-lg md:text-xl lg:text-xl space-y-5 ">
                    <div className="space-x-3">
                        <div className="border-black-400 rounded-full inline-block bg-white">
                            <svg className="w-4 sm:w-5 md:w-5 lg:w-5 h-4 sm:h-5 md:h-5 lg:h-5 text-[#626890] float-left mt-4 ml-2" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="ethereum" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                            <input className="p-3 rounded-full focus:outline-none w-10 sm:w-13 md:w-16 lg:w-20" type="number" value={betAmount} onChange={(event) => setBetAmount(event.target.value)} />
                            <span className="mr-3">ETH</span>
                        </div>
                        <div className="w-50 inline-block rounded-full bg-white p-3">
                            Your lucky number : <span className="font-bold text-white bg-black px-2 rounded-full">{target}</span>
                        </div>
                    </div>

                    <div className="space-x-3">
                        <button className="bg-white py-2 px-5 sm:px-7 md:px-9 lg:px-10 rounded-full" value="1" onClick={(event) => setTarget(event.target.value)}>1</button>
                        <button className="bg-white py-2 px-5 sm:px-7 md:px-9 lg:px-10 rounded-full" value="2" onClick={(event) => setTarget(event.target.value)}>2</button>
                        <button className="bg-white py-2 px-5 sm:px-7 md:px-9 lg:px-10 rounded-full" value="3" onClick={(event) => setTarget(event.target.value)}>3</button>
                        <button className="bg-white py-2 px-5 sm:px-7 md:px-9 lg:px-10 rounded-full" value="4" onClick={(event) => setTarget(event.target.value)}>4</button>
                        <button className="bg-white py-2 px-5 sm:px-7 md:px-9 lg:px-10 rounded-full" value="5" onClick={(event) => setTarget(event.target.value)}>5</button>
                        <button className="bg-white py-2 px-5 sm:px-7 md:px-9 lg:px-10 rounded-full" value="6" onClick={(event) => setTarget(event.target.value)}>6</button>
                    </div>
                </div>
                <div className="mt-5 space-y-5 text-md sm:text-lg md:text-xl lg:text-xl">
                    <button className={"bg-red-600 py-2 px-7 rounded-2xl font-bold block mx-auto" + ((lock || chainId != "0x4") ? " cursor-not-allowed" : "")} onClick={createBet} disabled={lock || chainId != "0x4"}>create bet</button>
                    <button className={"bg-red-600 py-2 px-10 rounded-2xl font-bold block mx-auto" + ((!lock || chainId != "0x4") ? " cursor-not-allowed" : "")} onClick={roll}>roll</button>
                </div>
            </div>

            <div className="w-full opacity-30">
                <Image
                    src="https://media.istockphoto.com/vectors/low-poly-trade-bull-and-bear-vector-id639935498?k=20&m=639935498&s=170667a&w=0&h=a4qCRysjwuABp7ZNJHqHaB9tQHyyEE2HU5TnnfCo-Ck="
                    layout="fill"
                    objectFit='cover'
                />
            </div>
        </div>
    )
}

export default Bet
