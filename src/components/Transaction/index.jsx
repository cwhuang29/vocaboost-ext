import React, { useState } from 'react';

import TransactionModal from '@components/Transaction/TransactionModal';

const title = '明細總覽';

export const CreditCardTransactionRecord = () => {
  const [open, setOpen] = useState(true);
  const onClose = () => setOpen(false);
  const record = {};

  return record ? (
    <TransactionModal
      open={open}
      onClose={onClose}
      info={{
        title,
        content: record,
      }}
    />
  ) : (
    <div />
  );
};

// Response resp.data (which is the data in line 21)
// {
//   "title": "Ines",
//   "allRecord": {
//       "loanRecord":{
//         "category":"小額貸款紀錄",
//         "balance":1010000,
//         "cost":"+1000000",
//         "notes":"信用卡"
//       },
//       "shoppeRecord":{"category":"蝦皮消費紀錄","balance":23000,"cost":"-987000","notes":"信貸"},
//       "uberEatRecord":{"category":"UberEat紀錄","balance":22832,"cost":"-168","notes":"信用卡–拆帳 (用戶Nick已扣款162元)"}
//   }
// }
