import { MyData } from "./components/app";
import { valueContainerCSS } from "react-select/lib/components/containers";
import moment from 'moment';

/** Returns true if strings are equal. Ignores case sensitivity. */
const compareInsensitive = (a:string, b:string) => (a.toLowerCase()).includes(b.toLowerCase());

/** Returns true if item contains name provided. */
const matchName = (name:string, item:MyData) =>
  compareInsensitive(item.firstName, name) ||
  compareInsensitive(item.lastName, name);

/** Returns true if item contains amount provided. */
const matchAmount = (amount:number, item:MyData) => item.amount === amount;

/** Returns true if item contains one of the provided colors. */
const matchColors = (colors:string[], item:MyData) => {
  // Field contains confusing name. Colors is not an array.
  const color = item.colors;
  return colors.map(c => c.toLowerCase()).includes(color);
};

/* Returns true if item's birthday is correctly relative (greater than or less than) to the date selected */
const compareDates = (dateStandard, dateIteration, operation) => {
  if (operation === "LTE") {
    return moment(dateIteration).isBefore(moment(dateStandard));
  } else if (operation === "GTE") {
    return moment(dateIteration).isAfter(moment(dateStandard));
  }
}

/* Calls Compare dates based on filter query or queries selected */
 const matchBirthday = (birthday:object, item:MyData) => {
  if (birthday.length === 1) {
    return compareDates(birthday[0].value, item.birthday, birthday[0].operation);
  } else if (birthday.length > 1) {
    return compareDates(birthday[0].value, item.birthday, birthday[0].operation) && compareDates(birthday[1].value, item.birthday, birthday[1].operation)
  } 

}

/** Returns true if item matches any of the query parameters. */
export const matchQuery = ( query:Query, item:MyData ) =>
  (query.name && matchName(query.name, item)) ||
  (query.amount !== undefined && matchAmount(query.amount, item)) ||
  (query.colors && matchColors(query.colors, item)) ||
  (query.birthday && matchBirthday(query.birthday, item)) ||
  (query.comment && matchComment(query.comment, item));


//Use a dictionary; an object - trans-language
/*
Map

rather than if, create object: Operation iterators
opIts = {
  [Operations.CONTAINS]: (item: string, value: string) => item.toLowerCase().includes(value.toLowerCase()),

}
filterItem = filterQuery.filterItem[0];
opIts[filterItem.operation](get(item, filterQuery.field, ''), filterItem.value);
*/

/* Returns true if item's comment matches the criteria of the query and operation */
const matchComment = (comment:object, item:MyData) => {
  return commentIterator[comment.operation](item.comment, comment.value);
}


let commentIterator = {
  CONTAINS: (item: string, value: string) => item.toLowerCase().includes(value.toLowerCase()),
  EQ: (item: string, value: string) => item.toLowerCase() === value.toLowerCase(),
  STARTS: (item: string, value: string) => item.toLowerCase().startsWith(value.toLowerCase()),
  ENDS: (item: string, value: string) => item.toLowerCase().endsWith(value.toLowerCase())
}


export interface Query {
  name?: string,
  amount?: number,
  colors?: string[],
  birthday: object,
  comment?: {
    operation: string,
    value: string
  }
}