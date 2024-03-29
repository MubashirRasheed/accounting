// @ts-nocheck
import { Formik } from 'formik';
import * as R from 'ramda';
import { Intent } from '@blueprintjs/core';
import { useInvoiceMailDialogBoot } from './InvoiceMailDialogBoot';
import { DialogsName } from '@/constants/dialogs';
import { AppToaster } from '@/components';
import { useSendSaleInvoiceMail } from '@/hooks/query';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import { InvoiceMailDialogFormContent } from './InvoiceMailDialogFormContent';
import { InvoiceMailFormSchema } from './InvoiceMailDialogForm.schema';
import {
  MailNotificationFormValues,
  initialMailNotificationValues,
  transformMailFormToRequest,
  transformMailFormToInitialValues,
} from '@/containers/SendMailNotification/utils';

const initialFormValues = {
  ...initialMailNotificationValues,
  attachInvoice: true,
};

interface InvoiceMailFormValues extends MailNotificationFormValues {
  attachInvoice: boolean;
}

function InvoiceMailDialogFormRoot({
  // #withDialogActions
  closeDialog,
}) {
  const { mailOptions, saleInvoiceId } = useInvoiceMailDialogBoot();
  const { mutateAsync: sendInvoiceMail } = useSendSaleInvoiceMail();

  const initialValues = transformMailFormToInitialValues(
    mailOptions,
    initialFormValues,
  );
  // Handle the form submitting.
  const handleSubmit = (values: InvoiceMailFormValues, { setSubmitting }) => {
    const reqValues = transformMailFormToRequest(values);

    setSubmitting(true);
    sendInvoiceMail([saleInvoiceId, reqValues])
      .then(() => {
        AppToaster.show({
          message: 'The mail notification has been sent successfully.',
          intent: Intent.SUCCESS,
        });
        closeDialog(DialogsName.InvoiceMail);
        setSubmitting(false);
      })
      .catch(() => {
        AppToaster.show({
          message: 'Something went wrong.',
          intent: Intent.DANGER,
        });
        setSubmitting(false);
      });
  };
  // Handle the close button click.
  const handleClose = () => {
    closeDialog(DialogsName.InvoiceMail);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={InvoiceMailFormSchema}
      onSubmit={handleSubmit}
    >
      <InvoiceMailDialogFormContent onClose={handleClose} />
    </Formik>
  );
}

export const InvoiceMailDialogForm = R.compose(withDialogActions)(
  InvoiceMailDialogFormRoot,
);
