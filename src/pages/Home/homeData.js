import React from 'react';

import BoltIcon from '@mui/icons-material/Bolt';
import ContactlessIcon from '@mui/icons-material/Contactless';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import EnhancedEncryptionIcon from '@mui/icons-material/EnhancedEncryption';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export const homePageFeatures = [
  {
    title: '消費盡情　更要精明',
    content: 'SnY Card 是一張金融卡，沒有年費。簽賬時直接從活期賬戶扣款，幫你更容易掌握開支預算。',
    icon: <ShoppingCartIcon color='error' sx={{ fontSize: 60, marginBottom: 2 }} />,
  },
  {
    title: '支援感應式 Visa payWave',
    content: '付款時輕拍卡即可，簡單便捷。無需刷卡或簽名。',
    icon: <ContactlessIcon color='error' sx={{ fontSize: 60, marginBottom: 2 }} />,
  },
  {
    title: '極致安全',
    content: '鎖卡及解鎖，在 App 內輕鬆辦妥。每筆交易均有即時推送通知，消費限額由你控制。',
    icon: <EnhancedEncryptionIcon color='error' sx={{ fontSize: 60, marginBottom: 2 }} />,
  },
  {
    title: 'SnY 2.0 Verify全新驗證體驗',
    content: '網購時開 App 確認交易，更流暢、更安全。',
    icon: <BoltIcon color='error' sx={{ fontSize: 60, marginBottom: 2 }} />,
  },
  {
    title: '現金提款',
    content: '以實體卡免費於全台所有銀行超過 26,000 部ATM提取現金，同時亦支援全球近 300 萬部ATM。',
    icon: <LocalAtmIcon color='error' sx={{ fontSize: 60, marginBottom: 2 }} />,
  },
  {
    title: '貼心設計',
    content: '實體卡沒有印上CVV及到期日，亦無需簽名，減少被盜用的風險。',
    icon: <CreditCardIcon color='error' sx={{ fontSize: 60, marginBottom: 2 }} />,
  },
];

export const homePageScenarios = [
  {
    redirectTo: '',
    title: '行動支付',
    img: '/assets/services/mobile-payment.jpeg',
  },
  {
    redirectTo: '',
    title: '信用卡',
    img: '/assets/services/credit-card.jpeg',
    disable: true,
  },
  {
    redirectTo: '',
    title: '貸款',
    img: '/assets/services/loan.jpeg',
    disable: true,
  },
  {
    redirectTo: '',
    title: '投資',
    img: '/assets/services/investment.jpeg',
    disable: true,
  },
  {
    redirectTo: '',
    title: '保險',
    img: '/assets/services/insurance.jpeg',
    disable: true,
  },
  {
    redirectTo: '',
    title: '信託',
    img: '/assets/services/trust.jpeg',
    disable: true,
  },
  {
    redirectTo: '',
    title: '財富管理',
    img: '/assets/services/fortune-management.jpeg',
    disable: true,
  },
];

// export const homePageScenarios = [
//   {
//     redirectTo: '/ecosystem/workers',
//     title: '小資族群',
//     content: '一二三四五六七八',
//     backgroundColor: '#F9C140',
//     img: '/assets/persona/worker.jpeg',
//   },
//   {
//     redirectTo: '/ecosystem/couples',
//     title: '新婚夫婦',
//     content: '一二三四五六七八',
//     backgroundColor: '#32C39F',
//     img: '/assets/persona/couple.jpeg',
//   },
//   {
//     redirectTo: '',
//     title: '學生族群',
//     content: '一二三四五六七八',
//     backgroundColor: '#F3B3DD',
//     img: '/assets/persona/student.jpeg',
//     disable: true,
//   },
//   {
//     redirectTo: '',
//     title: '微型企業',
//     content: '一二三四五六七八九十',
//     backgroundColor: '#2588FE',
//     img: '/assets/persona/business.jpeg',
//     disable: true,
//   },
//   {
//     redirectTo: '',
//     title: '退休族群',
//     content: '一二三四五六七八九十',
//     backgroundColor: '#A07BF9',
//     img: '/assets/persona/retiree.jpeg',
//     disable: true,
//   },
// ];
