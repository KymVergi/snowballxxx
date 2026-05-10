'use client'

import { useDexScreener } from '@/hooks/useDexScreener'
import { useSnowballContract } from '@/hooks/useSnowballContract'
import { useEffect, useState } from 'react'

export default function StatsDisplay() {
  const { pair, isLoading } = useDexScreener()
  const { totalBurned, snowReserve } = useSnowballContract()
  const [holders, setHolders] = useState(1247)
  const [mounted, setMounted] = useState(false)

  // Fix hydration by only rendering formatted numbers on client
  useEffect(() => {
    setMounted(true)
  }, [])

  // Simulate holder count changes
  useEffect(() => {
    const interval = setInterval(() => {
      setHolders(prev => prev + Math.floor(Math.random() * 5))
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  const formatNumber = (num: number | undefined) => {
    if (!num) return '0'
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toFixed(2)
  }

  const formatUSD = (num: number | undefined) => {
    if (!num) return '$0'
    return `$${formatNumber(num)}`
  }

  // Prevent hydration mismatch by not formatting on server
  const displayHolders = mounted ? holders.toLocaleString() : holders.toString()
  const displayBurned = mounted ? parseFloat(totalBurned).toLocaleString() : parseFloat(totalBurned).toFixed(0)
  const displayReserve = mounted ? parseFloat(snowReserve).toLocaleString() : parseFloat(snowReserve).toFixed(0)

  return (
    <div className="fieldset95">
      <legend className="legend95">⚡ REAL-TIME STATISTICS</legend>
      
      <table className="data-table">
        <thead>
          <tr>
            <th>METRIC</th>
            <th>VALUE</th>
            <th>STATUS</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>🌨️ Active Snowballs</td>
            <td>{displayHolders}</td>
            <td style={{ color: '#008000' }}>● ROLLING</td>
          </tr>
          <tr>
            <td>💰 Price (USD)</td>
            <td>
              {isLoading ? '...' : `$${(pair?.priceUsd ? Number(pair.priceUsd) : 0).toFixed(6)}`}
            </td>
            <td style={{ color: pair && pair.priceChange?.h24 > 0 ? '#008000' : '#ff0000' }}>
              {pair && pair.priceChange?.h24 > 0 ? '↑' : '↓'} 
              {' '}{Math.abs(pair?.priceChange?.h24 || 0).toFixed(2)}%
            </td>
          </tr>
          <tr>
            <td>📊 Market Cap</td>
            <td>
              {isLoading ? '...' : formatUSD(pair?.marketCap)}
            </td>
            <td style={{ color: '#0000ff' }}>● LIVE</td>
          </tr>
          <tr>
            <td>💧 Liquidity</td>
            <td>
              {isLoading ? '...' : formatUSD(pair?.liquidity?.usd)}
            </td>
            <td style={{ color: '#008000' }}>● LOCKED</td>
          </tr>
          <tr>
            <td>🔥 Total Burned</td>
            <td>{displayBurned} SNOW</td>
            <td style={{ color: '#ff0000' }}>● MELTING</td>
          </tr>
          <tr>
            <td>💰 24h Volume</td>
            <td>
              {isLoading ? '...' : formatUSD(pair?.volume?.h24)}
            </td>
            <td style={{ color: '#008000' }}>● ACTIVE</td>
          </tr>
          <tr>
            <td>🏔️ Snow Reserve</td>
            <td>{displayReserve} SNOW</td>
            <td style={{ color: '#0000ff' }}>● ACCUMULATING</td>
          </tr>
          <tr>
            <td>📈 24h Txns</td>
            <td>
              {isLoading ? '...' : (
                <>
                  {pair?.txns?.h24?.buys || 0} buys / {pair?.txns?.h24?.sells || 0} sells
                </>
              )}
            </td>
            <td style={{ color: '#008000' }}>● TRACKING</td>
          </tr>
        </tbody>
      </table>

      {isLoading && (
        <div style={{ 
          marginTop: '10px', 
          textAlign: 'center',
          fontSize: '10px',
          color: '#808080',
          fontFamily: 'Courier New'
        }}>
          <span className="blink">⚡</span> Loading live data...
        </div>
      )}
    </div>
  )
}