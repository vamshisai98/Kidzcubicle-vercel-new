import moment from 'moment';
import { DATE_FORMAT, SHORT_DATE_FORMAT } from './Constants';

export const CommonDateFormat = (date) => moment(date).format(DATE_FORMAT);

export const ShortDateFormat = (date) => moment(date).format(SHORT_DATE_FORMAT);

export const FormatDate = (date, format) => moment(date).format(format);
