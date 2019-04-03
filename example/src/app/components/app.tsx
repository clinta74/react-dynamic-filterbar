import React from 'react';
import FlexTable from 'react-flexbox-table';
import { filter, get } from 'lodash';
import { FilterBars, Filters, FilterBar, ChangeFQLHander, Operations, Logics } from '../../../../src/index';
import { customStyles } from '../../../../src/filter-bar/filters/select-filter';
import { data } from './example-data';
import { string } from 'prop-types';

const colors = ['red', 'green', 'blue', 'black', 'pink', 'yellow', 'orange', 'indigo'];

export type MyData = {
    firstName: string,
    lastName: string,
    comment: string,
    amount: number,
    birthday: string,
    colors: string,
}

type AppProps = {};
type AppState = {
    fql?: FilterBars.FilterQueryLanguage<MyData>,
}

export class App extends React.Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);
        this.state = {
            fql: undefined,
        }
    }

    onFilterUpdate: ChangeFQLHander<MyData> = (fql) => {
        console.log(' ===onFilterUpdate====');
        console.log('FQL: ', fql);
        this.setState({ fql });
    }

    stringContainsTest: ChangeFQLHander<MyData> = (fql) => {
        // console.log(' ===STRING CONTAINS TEST====');
        // console.log('Current FQL State: ', this.state.fql);
        let matches = [];
        let queries = this.state.fql.filterQueries;
        queries.forEach(query => {
            if (Array.isArray(query.field)) {
                let nameArray = [];
                console.log('Searching for name: ', query.filterItems[0].value);
                const searched = query.filterItems[0].value as string;
                const name = searched.toLowerCase();
                data.forEach(person => {
                    const first = person.firstName.toLowerCase();
                    const last = person.lastName.toLowerCase();
                    if (first.includes(name)) {
                        nameArray.push(person);
                    } else if (last.includes(name)) {
                        nameArray.push(person);
                    }
                });
                console.log('Matches: ', nameArray);
            }
        });


        
        
    }


    render() {
        const colorOptions = colors.map((c, i) => ({
            value: c,
            option: c,
        }));

        const { fql } = this.state;

        return (
            <section className="container">
                <h2>Filter Bar Example</h2>
                <div className="mb-4">
                    <FilterBar onFilterUpdate={this.onFilterUpdate} fql={fql} buttonClassName="btn">
                        <Filters.StringFilter<MyData> field={['firstName', 'lastName']} label="Name" className="form-control" buttonClassName="btn btn-primary" shown />
                        <Filters.StringFilter<MyData> field="comment" label="Comment" className="form-control" buttonClassName="btn btn-primary" showOperator />
                        <Filters.NumericFilter<MyData> field="amount" label="Amount" className="form-control" />
                        <Filters.SelectFilter<MyData> field="color" label="Colors" options={colorOptions} styles={customStyles} isMulti />
                    </FilterBar>
                    <button onClick={this.stringContainsTest} fql={fql}> Filter </button>
                    <button onClick = {() => {console.log(this.state)}}>Current State</button>
                </div>

                <div>
                    <FlexTable.DataTable items={data}>
                        <FlexTable.BoundColumn<MyData> binding={item => item.firstName} headerText="First Name" className="col-3"/>
                        <FlexTable.BoundColumn<MyData> binding={item => item.lastName} headerText="Last Name" className="col-3"/>
                        <FlexTable.BoundColumn<MyData> binding={item => item.comment} headerText="Comment" className="col-6"/>
                    </FlexTable.DataTable>
                </div>
            </section>
        );
    }
}

// const filterData = (items: MyData[], fql?: FilterBars.FilterQueryLanguage<MyData>):MyData[] => {
//     if(!!fql) {
//         items.filter(item => {
//             if(fql.logic == Logics.AND) {
//                 return fql.filterQueries.some(fq => {
//                     const fields = Array.from(fq.field);

//                     return fields.every(field => {
//                         const value = item[field as keyof MyData];
//                         fq.filterItems.some(filterI(value as string).includes(fq)
//                         return true;
//                     });
//                 })
//             }
//         })
//         const filters = fql.filterQueries.map(fq => {
//         })
//         return filter(items);
//     } 

//     return items;
// }
