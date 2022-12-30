import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { createForm } from '@actions/form';
import { FORM_OPERATION_TYPE } from '@constants/form';
import msg from '@constants/messages';
import { GLOBAL_MESSAGE_SERVERITY } from '@constants/styles';
import { useGlobalMessageContext } from '@hooks/useGlobalMessageContext';
import { isAdmin } from '@utils/admin.js';

import FormEdit from './FormEdit';

const FormCreate = () => {
  const navigate = useNavigate();
  const isAdminUser = isAdmin();
  const { addGlobalMessage } = useGlobalMessageContext();

  const title = '創建新量表';
  const submitAction = data => createForm(data);

  useEffect(() => {
    if (isAdminUser) {
      return;
    }

    addGlobalMessage({
      title: msg.PERMISSION_DENIED,
      severity: GLOBAL_MESSAGE_SERVERITY.ERROR,
      timestamp: Date.now(),
    });
    navigate('/');
  }, []);

  return isAdminUser ? <FormEdit title={title} operationType={FORM_OPERATION_TYPE.CREATE} submitAction={submitAction} /> : null;
};

export default FormCreate;
