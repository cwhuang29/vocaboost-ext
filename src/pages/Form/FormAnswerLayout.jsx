import React from 'react';
import { useParams } from 'react-router';
import PropTypes from 'prop-types';

import PageWrapper from '@components/HomePageWrapper';
import formService from '@services/form.service';
import withFetchService from '@shared/hooks/withFetchService';

import FormAnswer from './FormAnswer';

const FormAnswerLayoutView = props => {
  const { data, error, isLoading } = props;
  const { data: formData = {} } = data;

  return (
    // eslint-disable-next-line no-nested-ternary
    <PageWrapper>{isLoading ? <h3>Hold on a second ... </h3> : Object.keys(error).length !== 0 ? <div /> : <FormAnswer formData={formData} />}</PageWrapper>
  );
};

const getAnswerFormForComponent = formId => () => formService.getAnswerForm(formId);

const FormAnswerLayout = React.memo(() => {
  const { formId } = useParams();
  const FormAnswerWithData = withFetchService(FormAnswerLayoutView, getAnswerFormForComponent(formId), false);
  return <FormAnswerWithData />;
});

FormAnswerLayoutView.propTypes = {
  data: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.object.isRequired,
};

export default FormAnswerLayout;
