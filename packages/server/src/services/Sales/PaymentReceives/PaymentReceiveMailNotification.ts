import { Inject, Service } from 'typedi';
import {
  PaymentReceiveMailOpts,
  PaymentReceiveMailOptsDTO,
  SendInvoiceMailDTO,
} from '@/interfaces';
import Mail from '@/lib/Mail';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import {
  DEFAULT_PAYMENT_MAIL_CONTENT,
  DEFAULT_PAYMENT_MAIL_SUBJECT,
} from './constants';
import { GetPaymentReceive } from './GetPaymentReceive';
import { ContactMailNotification } from '@/services/MailNotification/ContactMailNotification';
import { parseAndValidateMailOptions } from '@/services/MailNotification/utils';

@Service()
export class SendPaymentReceiveMailNotification {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private getPaymentService: GetPaymentReceive;

  @Inject()
  private contactMailNotification: ContactMailNotification;

  @Inject('agenda')
  private agenda: any;

  /**
   * Sends the mail of the given payment receive.
   * @param {number} tenantId
   * @param {number} paymentReceiveId
   * @param {PaymentReceiveMailOptsDTO} messageDTO
   * @returns {Promise<void>}
   */
  public async triggerMail(
    tenantId: number,
    paymentReceiveId: number,
    messageDTO: PaymentReceiveMailOptsDTO
  ): Promise<void> {
    const payload = {
      tenantId,
      paymentReceiveId,
      messageDTO,
    };
    await this.agenda.now('payment-receive-mail-send', payload);
  }

  /**
   * Retrieves the default payment mail options.
   * @param {number} tenantId - Tenant id.
   * @param {number} paymentReceiveId - Payment receive id.
   * @returns {Promise<PaymentReceiveMailOpts>}
   */
  public getMailOptions = async (
    tenantId: number,
    paymentId: number
  ): Promise<PaymentReceiveMailOpts> => {
    const { PaymentReceive } = this.tenancy.models(tenantId);

    const paymentReceive = await PaymentReceive.query()
      .findById(paymentId)
      .throwIfNotFound();

    const formatterData = await this.textFormatter(tenantId, paymentId);

    return this.contactMailNotification.getMailOptions(
      tenantId,
      paymentReceive.customerId,
      DEFAULT_PAYMENT_MAIL_SUBJECT,
      DEFAULT_PAYMENT_MAIL_CONTENT,
      formatterData
    );
  };

  /**
   * Retrieves the formatted text of the given sale invoice.
   * @param {number} tenantId - Tenant id.
   * @param {number} invoiceId - Sale invoice id.
   * @param {string} text - The given text.
   * @returns {Promise<string>}
   */
  public textFormatter = async (
    tenantId: number,
    invoiceId: number
  ): Promise<Record<string, string>> => {
    const payment = await this.getPaymentService.getPaymentReceive(
      tenantId,
      invoiceId
    );
    return {
      CustomerName: payment.customer.displayName,
      PaymentNumber: payment.payment_receive_no,
      PaymentDate: payment.formattedPaymentDate,
      PaymentAmount: payment.formattedAmount,
    };
  };

  /**
   * Triggers the mail invoice.
   * @param {number} tenantId
   * @param {number} saleInvoiceId
   * @param {SendInvoiceMailDTO} messageDTO
   * @returns {Promise<void>}
   */
  public async sendMail(
    tenantId: number,
    paymentReceiveId: number,
    messageDTO: SendInvoiceMailDTO
  ): Promise<void> {
    const defaultMessageOpts = await this.getMailOptions(
      tenantId,
      paymentReceiveId
    );
    // Parsed message opts with default options.
    const parsedMessageOpts = parseAndValidateMailOptions(
      defaultMessageOpts,
      messageDTO
    );
    await new Mail()
      .setSubject(parsedMessageOpts.subject)
      .setTo(parsedMessageOpts.to)
      .setContent(parsedMessageOpts.body)
      .send();
  }
}
