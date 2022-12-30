import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import { getAllForms } from '@actions/form';
import { ConfirmButton } from '@components/Button';
import DataGrid from '@components/DataGrid';
import msg from '@constants/messages';
import { GLOBAL_MESSAGE_SERVERITY } from '@constants/styles';
import { useGlobalMessageContext } from '@hooks/useGlobalMessageContext';
import formService from '@services/form.service';
import withFetchService from '@shared/hooks/withFetchService';
import { exportCSV } from '@utils/export';
import { getDisplayTime } from '@utils/time';

const columns = [
  {
    field: 'formName',
    headerName: '量表名稱',
    flex: 1,
    // align: 'center',
  },
  {
    field: 'formCustId',
    headerName: '量表編碼',
    flex: 1,
  },
  {
    field: 'researchName',
    headerName: '所屬計畫',
    flex: 1,
    align: 'left',
    valueFormatter: ({ value }) => value.join(', '),
    renderCell: params => (
      <div>
        {params.value.map(p => (
          <div key={p} style={{ fontSize: '0.8rem !important', margin: '2px 0px' }}>
            {p}
          </div>
        ))}
      </div>
    ),
  },
  {
    field: 'author',
    headerName: '作者',
    flex: 0.5,
  },
  {
    field: 'updatedAt',
    headerName: 'Updated At',
    flex: 0.75,
    type: 'dateTime',
    valueFormatter: ({ value }) => getDisplayTime(new Date(value)),
  },
  {
    field: 'createdAt',
    headerName: 'Created At',
    flex: 0.75,
    type: 'dateTime',
    valueFormatter: ({ value }) => getDisplayTime(new Date(value)),
  },
];

const FormListView = props => {
  const navigate = useNavigate();
  const { data, error, isLoading } = props;
  const { data: formData = [] } = data;
  // const rows = data?.constructor === Array ? data : []; // Error: withFetchService HOC returns {} when response is not ready yet
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const { addGlobalMessage } = useGlobalMessageContext();
  const confirmButtonText = '輸出表單';

  const onCellDoubleClick = params => {
    if (params.field === 'formName') {
      navigate(`/forms/${params.id}`);
    }
  };

  const onSelectionModelChange = ids => setSelectedRows(ids); // An array contains ids of all rows selected

  const exportAllSelectedForm = formIds => formService.exportSelectedForms(formIds);

  const generateCSV = resultData => {
    // console.log(JSON.stringify(resultData, null, 2));
    const resultDataSortBySelectedOrder = resultData.sort((a, b) => selectedRows.indexOf(a.id) - selectedRows.indexOf(b.id));

    const csvBody = new Map();
    resultDataSortBySelectedOrder.forEach(form =>
      form.results.forEach(result => {
        csvBody.set(result.email, [result.name, result.email, result.role]);
        // csvBody[result.email] = [result.name, result.email, result.role];
      })
    );

    let csvTitle = ['Name', 'Email', 'Role'];
    const commonTitle = ['Answer Time', 'Score'];

    resultDataSortBySelectedOrder.forEach(form => {
      const questionIds = Array(form.maxQuestionsCount)
        .fill()
        .map((_, idx) => `${form.formCustId}${idx}`);
      csvTitle = [...csvTitle, ...commonTitle.map(t => `${t} (${form.formCustId})`), ...questionIds];

      const emailsOfThisForm = form.results.map(result => result.email);
      // Set up empty-value cells for each users
      Array.from(csvBody).forEach(([key, val]) => {
        if (!emailsOfThisForm.includes(key)) {
          const emptyAttr = { answerTime: '', score: '' };
          const emptyAnswers = [emptyAttr.answerTime, emptyAttr.score, ...Array(form.maxQuestionsCount).fill('')];
          csvBody.set(key, val.concat(emptyAnswers));
          // csvBody[key] = val.concat(emptyAnswers);
        }
      });

      // Fill in values if the user has answered forms
      form.results.forEach(result => {
        const parsedAnswers = result.answers.map(answer => answer.replaceAll('\n', '\u2028')); // Ensure the newlines won't break the format of exported CSVs
        const userAnswers = [result.answerTime, result.score, ...parsedAnswers, ...Array(form.maxQuestionsCount - result.answers.length).fill('')];
        csvBody.set(result.email, csvBody.get(result.email).concat(userAnswers));
        // csvBody[result.email] = csvBody.get(result.email).concat(userAnswers);
      });
    });

    let csvRows = [csvTitle];
    // eslint-disable-next-line no-restricted-syntax
    for (const value of csvBody.values()) {
      csvRows = [...csvRows, value];
    }

    return csvRows;
  };

  const submit = async () => {
    const resultData = await exportAllSelectedForm(selectedRows)
      .then(resp => {
        addGlobalMessage({
          title: resp.title,
          severity: GLOBAL_MESSAGE_SERVERITY.SUCCESS,
          timestamp: Date.now(),
        });
        return resp.data;
      })
      .catch(err => {
        addGlobalMessage({
          title: err.title,
          content: err.content,
          severity: GLOBAL_MESSAGE_SERVERITY.ERROR,
          timestamp: Date.now(),
        });
      });
    return resultData;
  };

  const onConfirm = async () => {
    if (loading) {
      return;
    }

    if (!selectedRows.length) {
      addGlobalMessage({
        title: msg.NO_DATA,
        severity: GLOBAL_MESSAGE_SERVERITY.WARNING,
        timestamp: Date.now(),
      });
      return;
    }

    setLoading(true);
    addGlobalMessage({
      title: msg.REQUEST_IS_HANDLING,
      severity: GLOBAL_MESSAGE_SERVERITY.INFO,
      timestamp: Date.now(),
    });

    const resultData = await submit();
    const csvRows = generateCSV(resultData);
    const fileName = `Form Answer Record ${getDisplayTime()}`;
    exportCSV(csvRows.join('\n'), fileName);
    setLoading(false);
  };

  return (
    Object.keys(error).length === 0 && (
      <>
        <DataGrid
          isLoading={isLoading}
          columns={columns}
          rows={formData}
          onCellDoubleClick={onCellDoubleClick}
          checkboxSelection
          onSelectionModelChange={onSelectionModelChange}
          height={615}
        />
        <div style={{ marginTop: '20 !important' }}>
          <ConfirmButton onConfirm={onConfirm} disabledConfirm={isLoading || loading} confirmButtonText={confirmButtonText} />
        </div>
      </>
    )
  );
};

const getAllFormsForComponent = () => getAllForms();

const FormList = withFetchService(FormListView, getAllFormsForComponent);

FormListView.propTypes = {
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.object.isRequired,
};

export default FormList;
