import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import FormList from '@components/Form/FormList';
import { GLOBAL_MESSAGE_SERVERITY } from '@constants/styles';
import { useGlobalMessageContext } from '@hooks/useGlobalMessageContext';

import { RenderExample, TestMemo } from './MemoExperiment';

export default function Test() {
  const { addGlobalMessage } = useGlobalMessageContext();
  const { testId } = useParams();
  const { test02Id } = useParams();

  useEffect(() => {
    addGlobalMessage({
      title: 'This is title 00',
      content: '',
      severity: GLOBAL_MESSAGE_SERVERITY.ERROR,
      timestamp: Date.now(),
      enableClose: true,
    });
    addGlobalMessage({
      title: 'This is title 01',
      content: '',
      severity: GLOBAL_MESSAGE_SERVERITY.ERROR,
      timestamp: Date.now(),
      enableClose: true,
    });
    addGlobalMessage({
      title: 'This is title 02',
      severity: GLOBAL_MESSAGE_SERVERITY.ERROR,
      timestamp: Date.now(),
    });
    setTimeout(
      () =>
        addGlobalMessage({
          title: 'Title 03',
          content: 'This is content. As part of the customization API, the grid allows you to override internal components with the components prop.',
          severity: GLOBAL_MESSAGE_SERVERITY.ERROR,
          enableClose: true,
          timestamp: Date.now(),
        }),
      1000
    );
    setTimeout(
      () =>
        addGlobalMessage({
          title: 'Title 04',
          content:
            'As part of the customization API, the grid allows you to override internal components with the components prop. The prop accepts an object of type GridSlotsComponent. \n If you wish to pass additional props in a component slot, you can do it using the componentsProps prop. This prop is of type GridSlotsComponentsProps.',
          severity: GLOBAL_MESSAGE_SERVERITY.ERROR,
          timestamp: Date.now(),
          enableClose: true,
        }),
      1500
    );
  }, [addGlobalMessage]);

  return (
    <>
      <div>
        {testId} -- {test02Id}
      </div>
      <div> First line !!!!!!!!!!!!!!!!!!!! </div>
      <FormList />
      <TestMemo />
      <RenderExample />
    </>
  );
}
