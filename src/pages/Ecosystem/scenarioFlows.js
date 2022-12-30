import React from 'react';

import CakeIcon from '@mui/icons-material/Cake';
import CottageIcon from '@mui/icons-material/Cottage';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import FreeBreakfastIcon from '@mui/icons-material/FreeBreakfast';
import HikingIcon from '@mui/icons-material/Hiking';
import LiquorIcon from '@mui/icons-material/Liquor';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import WcIcon from '@mui/icons-material/Wc';

export const scenarioFlows = {
  students: [
    {
      title: '專為剛畢業的你所打造',
      backgroundColor: '#E8D8BD',
      flow: [
        { label: '開始還學貸囉', icon: <WcIcon /> },
        { label: '如何申請薪轉戶', icon: <WcIcon /> },
        { label: '幫自己保一張工作意外險吧', icon: <WcIcon /> },
        { label: '定期信用卡繳款', icon: <WcIcon /> },
      ],
    },
  ],
  workers: [
    {
      title: '華南好食',
      // backgroundColor: '#E4DACE',
      // backgroundColor: '#DCC1B0',
      // backgroundColor: '#E3A6A1',
      backgroundColor: '#E8D8BD',
      flow: [
        {
          label: '超商買早餐',
          icon: <FreeBreakfastIcon />,
          info: {
            title: '【行動支付】SnY Pay四大超商買早餐',
            content:
              '台灣Pay採用QR Code 共通支付規格，不限手機品牌、型號皆可使用，並提供購物、轉帳、繳費、繳稅、提款...等功能。於四大超商使用SnY Pay或SnY數位銀行App綁定華南金融/信用卡掃碼付款，即可獲得最高npoints回饋。',
          },
        },
        {
          label: '懶得出門買午餐',
          icon: <LunchDiningIcon />,
          info: {
            title: '【線上支付】外送平台叫午餐',
            content:
              '華南i 網購生活卡享foodpanda、UberEats、Catchplay、Spotify、KKBOX 等指定通路額外8% 的現金回饋（上限NT$200/月），相當於每月最高刷NT$2,500，此外，華南i 網購生活卡再享網購、行動支付綁定SnY 數位帳戶自動扣繳後3% 現金回饋。',
          },
        },
        {
          label: '團購下午茶',
          icon: <CakeIcon />,
          info: {
            title: '【線上團購】團購小n幫你訂下午茶',
            content:
              '華南用戶只要輕鬆兩步驟，首先在LINE APP加入團購小n帳號並綁定華南LINE官方帳號後，將團購小n帳號加入朋友聊天群組中，即可隨時呼叫團購小n發起團購，搞定團購大小事；團購小n可以聰明地協助建立團購清單，自動彙整商品品項與金額，讓團員可以輕鬆+1跟團加購。訂單直接串接SnY數位銀行轉帳功能，讓團員一鍵轉帳、輕鬆付款。最後團購小n會整理訂單，讓團主從商品到金額明細一目瞭然，協助團主輕鬆收款對帳。\n\n團購群組結合數位銀行功能，未來團主再也不需要逐筆填寫商品清單，即可快速開團，每筆訂單皆保留交易記錄，重啟團購只要一鍵就能輕鬆完成，華南商銀用心解決民眾生活大小事。',
          },
        },
        {
          label: '下班開趴囉',
          icon: <LiquorIcon />,
          info: {
            title: '【消費分期】晚上大型聚餐消費申請分期',
            content:
              '偶爾有大額消費，也能輕鬆付。多種期數，一鍵申請，為您減輕一次還款的壓力，讓生活更聰明，理財管帳更彈性！\n\n登入SnY數位銀行APP→瀏覽交易明細→點選帶有月曆圖示之消費，即可線上操作申請分期，點選「小n分期付」選擇消費分期，並選擇欲轉為分期付款之消費，確認承作內容及注意事項，即完成申請！小n分期付讓你還款更輕鬆，理財更彈性。',
          },
        },
      ],
    },
    {
      title: '樂在華南',
      backgroundColor: '#EF9F8F',
      flow: [
        {
          label: '下班休假趣',
          icon: <HikingIcon />,
          info: {
            title: '行程配交通（信用卡飯店優惠）[雄獅旅遊、高鐵]',
            content:
              '華南享利樂活Combo卡國內一般消費新戶享刷卡金回饋最優1.3%，無上限\n累積滿NT$6,000(含)以上，送7-11現金抵用券NT$200\n累積滿NT$15,000(含)以上，送7-11現金抵用券NT$500\n使用華南信用卡於雄獅旅行社刷卡訂房入住國內飯店，享單筆2,000元以上折價200元；單筆4,000元以上折價400元優惠。',
          },
        },
        {
          label: '景點速購票',
          icon: <LocalActivityIcon />,
          info: {
            title: '景點速購票[KKday/KLook]',
            content:
              'KKday：華南信用/金融卡綁定SnY Pay回饋3%n Points (回饋上限600點)\n好禮1：新戶刷滿額享SnY新戶好禮，累積消費滿NT$3,000享免費旅遊金KKday Points10,000點（價值1,500元）即日起至2021/12/31\n好禮2：「輸入折扣碼：SnY速購票」卡號前8碼全站商品85折優惠\nKlook：用戶憑華南信用/金融卡綁定SnY Pay，預訂精選景點門票及旅遊產品，並輸入優惠碼，可享95折優惠',
          },
        },
        {
          label: '租車趴趴造',
          icon: <DirectionsCarIcon />,
          info: {
            title: '開車出發去(車貸產品)',
            content:
              '購置新車出遊去！低頭款擁有新車，不需高額自備款，貸款成數可到九成以上、最高可達車價的百分百，讓您輕鬆購車。2.88%起低月付，最長84期；讓月付金大幅減少，繳款更輕鬆。各種國產、進口車皆可辦理。\n\n產品特色：\n1. 經本行核准之申貸金額，一次匯入您的帳戶內或車商賣方。2. 專人服務，手續費透明。3. 專人說明貸款事宜及簽約文件，對保手續一次完成，減少您的路程往返。適用對象：1. 年滿20~65歲，有正當職業具還款能力之本國國民、公司戶及自營商亦可辦理。2. 買車或換車，有貸款資金需求者。\n3. 專人說明貸款事宜及簽約文件，對保手續一次完成，減少您的路程往返。\n適用對象：1. 年滿20~65歲，有正當職業具還款能力之本國國民、公司戶及自營商亦可辦理。2. 買車或換車，有貸款資金需求者。',
          },
        },
        {
          label: '平安回小窩',
          icon: <CottageIcon />,
          info: {
            title: '旅遊保安全（華南個人保險）',
            content:
              '旅行綜合險：出國狀況多，玩得開心，也要玩得安心！\n全面保障：海外旅遊享全程10多項保障\n產險卡好：別讓鳥事壞心情，產險才有不便險\n24H不打烊：出發前1小時即可保(多人旅遊出發前7天)\n保費便宜：百餘元起，三種方案任您選\n詳細內容以保單條款為準，華南產險保留承保與否之權利。',
          },
        },
      ],
    },
    {
      title: '華美新衣',
      backgroundColor: '#3B3857',
      flow: [
        {
          label: '坐車逛網拍',
          icon: null,
          info: {
            title: '坐車逛網拍',
            content:
              '穿新衣買lativ，輕鬆穿出無印風，刷華南信用卡滿1,000元送華南100元現金回饋，滿2,000元送250元現金回饋。穿新鞋買網紅熱店D+AF，與知名網紅合作同款聯名鞋，讓你時尚不退後，刷滿華南信用卡滿1,500元，送150元現金回饋。',
          },
        },
        {
          label: '下班好好逛',
          icon: null,
          info: {
            title: '下班好好逛',
            content:
              '累了一天了是該享受一下悠閒的下班時光，來場試衣冒險妝點自己，讓自己美美的，來華南合作的服飾店家Uniqlo刷取信用卡消費滿20,000元，領取滿額贈禮Harrow HT-AF1000空氣炸鍋。',
          },
        },
        {
          label: '出清換新款',
          icon: null,
          info: {
            title: '出清換新款',
            content:
              '出清舊衣放上旋轉拍賣，既能把舊衣作出清與利用，在買新衣同時也能釋放衣櫃空間，華南銀行與旋轉拍賣合作，當月出清滿10件，即可領取旋轉拍賣專屬華南銀行優惠券折扣100元。',
          },
        },
      ],
    },
  ],
  couples: [
    {
      title: '與你浪漫度一生',
      backgroundColor: '#F8B2A5',
      flow: [
        {
          label: '與你訂下誓言',
          icon: null,
          info: {
            title: '與你訂下誓言',
            content: '買TIFFANY & Co戒指，滿15萬元以上即可享有專屬棚內拍照體驗，幫你打造專屬場景，與知名妝髮設計師合作，留下美好回憶。',
          },
        },
        {
          label: '貸向幸福的道路',
          icon: null,
          info: {
            title: '貸向幸福的道路',
            content:
              '聘金、會場布置、主持人/新秘/婚攝費用、相關人員紅包花費可不少，提供免費貸款諮詢服務，及24小時線上申請管道，營業時間線上申請，最快1小時資金極速入帳。推薦您運用信用貸款補足資金缺口，分為兩個額度貸款10萬與貸款20萬，前兩期0.88%，第三期5.05%。',
          },
        },
        {
          label: '浪漫旅途',
          icon: null,
          info: {
            title: '浪漫旅途',
            content:
              '和伴侶創造共同美好回憶，實現夢中浪漫蜜月之旅，『國外訂房』全館最優享15%優惠，使用華南信用卡於雄獅旅行社刷卡訂房入住國外飯店，享單筆15,000元以上折價800元；單筆50,000元以上送30吋登機箱。',
          },
        },
        {
          label: '幸福小撲滿',
          icon: null,
          info: {
            title: '幸福小撲滿',
            content: '申請結婚基金專屬數位帳戶，共同維持幸福的家，每月雙方分別匯款一萬即可享有限定結婚基金專屬匯率2.5%，最高限額30萬，超過額度即降為1%匯率。',
          },
        },
      ],
    },
    {
      title: '浪漫滿屋',
      backgroundColor: '#8EC0CA',
      flow: [
        {
          label: '貸一個愛的重量',
          icon: null,
          info: {
            title: '貸一個愛的重量',
            content:
              '華南銀行與『東森房屋』合作，根據您的需求找出您理想中的房屋需求並進行試算金額，讓你快速找到心目中的溫暖小屋。\n\n華南也能根據購物試算結果提供各式房屋貸款方案，快速試算可借貸額度和利率，保留不同房子的貸款方案納入您的購屋考量。',
          },
        },
        {
          label: '減少愛的負擔',
          icon: null,
          info: {
            title: '減少愛的負擔',
            content: '華南根據您的需求建立客製化的租屋補助推播訊息，讓你不漏接各項補助資訊，讓你輕鬆、快速申請各項租屋補助。',
          },
        },
        {
          label: '妝點愛巢',
          icon: null,
          info: {
            title: '『新屋裝潢』讓你創造滿滿的回憶',
            content:
              '華南與『PRO 360達人網』合作，提供現代簡約風、工業風、北歐風、日式、歐式等風情等裝潢風格提案，以及室內設計、老屋翻新、系統家具、廚衛改裝、油漆工程、壁癌漏水等服務，讓你輕鬆獲得裝潢鑑價，妝點你的浪漫小屋。\n\n華南也提供裝潢信用貸款服務，讓你取得現金方便又快速、一次完成所有裝潢項目，並協助您實現理想宅，給愛侶、家人溫暖舒適的居家環境。',
          },
        },
      ],
    },
    {
      title: '幸福生活',
      backgroundColor: '#013764',
      flow: [
        {
          label: '早安晨之美',
          icon: null,
          info: {
            title: '早安晨之美',
            content:
              '使用SnY Pay於Q Burger、全聯、家樂福、麥當勞、肯德基、摩斯漢堡等指定通路享95折優惠，每月消費滿5000元再享5%現金回饋，讓你天天早上享受美味早餐。',
          },
        },
        {
          label: '午餐充飽電',
          icon: null,
          info: {
            title: '午餐充飽電',
            content:
              '華南i 網購生活卡享foodpanda、UberEats等指定通路額外8% 的現金回饋（上限NT$200/月），相當於每月最高刷NT$2,500，此外，華南i 網購生活卡再享網購、行動支付綁定SnY 數位帳戶自動扣繳後3% 現金回饋。',
          },
        },
        {
          label: '慶祝我們的紀念日',
          icon: null,
          info: {
            title: '慶祝我們的紀念日',
            content:
              '華南銀行與新光三越推出「好食聯名信用卡」，於新光三越餐廳店家使用聯名信用卡消費可享專屬優惠，每月消費滿10,000元更可獲得「小n好食」專屬抱枕(數量有限，送完為止)。',
          },
        },
      ],
    },
  ],
  business: [],
  retirees: [],
};
