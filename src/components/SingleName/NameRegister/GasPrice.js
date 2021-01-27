import React, { useState } from 'react'
import styled from '@emotion/styled/macro'
import { useTranslation, Trans } from 'react-i18next'
import mq from 'mediaQuery'
import EthVal from 'ethval'
import DefaultInput from '../../Forms/Input'
const GWEI = 1000000000
const COMMIT_GAS_WEI = 42000
const REGISTER_GAS_WEI = 240000

const PriceContainer = styled('div')`
  width: 100%;
  ${mq.medium`
    width: auto
  `}
  margin:5px 0;
`

const Value = styled('div')`
  font-family: Overpass;
  font-weight: 100;
  font-size: 22px;
  color: #2b2b2b;
  border-bottom: 1px solid #dbdbdb;
  ${mq.small`
    font-size: 28px;
  `}
`

const TotalValue = styled(Value)`
  font-weight: 300;
`

const Description = styled('div')`
  font-family: Overpass;
  font-weight: 300;
  font-size: 14px;
  color: #adbbcd;
  margin-top: 10px;
`

const USD = styled('span')`
  font-size: 22px;
  color: #adbbcd;
  margin-left: 20px;
  ${mq.small`
    font-size: 28px;
  `}
`

const Input = styled(DefaultInput)`
  display: inline-block;
  width: 4em;
  margin: 5px 0;
`

const Price = ({ price, ethUsdPrice, initialGasPrice }) => {
  const { t } = useTranslation()
  const [gasPrice, setGasPrice] = useState(initialGasPrice)
  const handleGasPrice = e => {
    setGasPrice((e.target.value || 0) * GWEI)
  }

  const ethVal = new EthVal(`${price}`).toEth()
  const commitGas = new EthVal(`${COMMIT_GAS_WEI * gasPrice}`).toEth()
  const registerGas = new EthVal(`${REGISTER_GAS_WEI * gasPrice}`).toEth()
  const gasPriceToGwei = new EthVal(`${gasPrice}`).toGwei()
  const totalGas = commitGas.add(registerGas)
  const totalGasInUsd = totalGas.mul(ethUsdPrice)
  const buffer = ethVal.div(10)
  const total = ethVal.add(buffer).add(totalGas)
  const totalInUsd = total.mul(ethUsdPrice)
  return (
    <>
      <PriceContainer>
        <Value>
          {totalGas.toFixed(3)} ETH ({commitGas.toFixed(3)} ETH +{' '}
          {registerGas.toFixed(3)} ETH){' '}
          <Trans i18nKey="pricer.gasValue">
            when the gas price is
            <Input
              value={gasPriceToGwei.toFixed(0)}
              onChange={handleGasPrice}
            />{' '}
            Gwei
          </Trans>
          {ethVal && ethUsdPrice && (
            <USD>
              {' '}
              = ${totalGasInUsd.toFixed(2)}
              USD
            </USD>
          )}
        </Value>
        <Description>{t('pricer.gasDescription')}</Description>
      </PriceContainer>
      <PriceContainer>
        <TotalValue>
          {total.toFixed(3)} ETH ({ethVal.toFixed(3)} ETH + {buffer.toFixed(3)}{' '}
          ETH + {totalGas.toFixed(3)} ETH)
          {ethVal && ethUsdPrice && (
            <USD>
              {' '}
              = ${totalInUsd.toFixed(2)}
              USD
            </USD>
          )}
        </TotalValue>
        <Description>{t('pricer.totalDescription')}</Description>
      </PriceContainer>
    </>
  )
}

export default Price
