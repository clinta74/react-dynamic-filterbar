import React from 'react';
import { BoundColumn, DataTable } from 'react-flex-data-table';
import { FilterBar, ChangeFQLHander } from '../../../../src/index';
import { customStyles } from '../../../../src/filter-bar/filters/select-filter';
import { data } from './example-data';
import moment from 'moment';
import { StringFilter, NumericFilter, SelectFilter, DateFilter } from '../../../../src/filter-bar';
import { dateComparer, filterData, FilterMapper, FilterQueryLanguage, numberComparer, stringComparer } from 'filter-query-language-core';

const color = ['red', 'green', 'blue', 'black', 'pink', 'yellow', 'orange', 'indigo'];

export type MyData = {
    firstName: string,
    lastName: string,
    comment: string,
    amount: number,
    birthday: string,
    color: string,
}

type AppProps = {};
type AppState = {
    fql?: FilterQueryLanguage<MyData>,
    display: MyData[],
    filterApplied: boolean,
}

const fieldToIteratorMapper: FilterMapper<MyData> = {
    firstName: stringComparer,
    lastName: stringComparer,
    comment: stringComparer,
    amount: numberComparer,
    birthday: dateComparer,
    color: stringComparer,
  }

export class App extends React.Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);
        this.state = {
            fql: undefined,
            display: data,
            filterApplied: false,
        }
    }

    private onFilterUpdate: ChangeFQLHander<MyData> = (fql) => {
        console.log('FQL: ', fql);
        this.setState({
            fql,
            filterApplied: false,
        });
    }

    /** Executes currently selected filters on data set */
    private runFilters: React.MouseEventHandler<HTMLButtonElement> = () => {
        const { fql } = this.state;
        if (!!fql) {
            const filteredData = filterData(data, fieldToIteratorMapper, fql);

            this.setState({
                display: filteredData,
                filterApplied: true,
            });
        }
    }

    render() {
        const colorOptions = color.map((c) => ({
            value: c,
            option: c,
        }));

        const { fql, filterApplied } = this.state;

        return (
            <section className="container">
                <h2>Filter Bar Example</h2>
                <div className="mb-4">
                    <FilterBar<MyData> onFilterUpdate={this.onFilterUpdate} fql={fql} buttonClassName="btn" filterItemClassName="d-flex" labelClassName="d-block mb-0" className="d-md-flex flex-wrap">
                        <StringFilter<MyData> field={["firstName", "lastName"]} label="Name" className="form-control" buttonClassName="btn btn-primary" showOperator/>
                        <StringFilter<MyData> field="comment" label="Comment" className="form-control" buttonClassName="btn btn-primary" showOperator/>
                        <NumericFilter<MyData> field="amount" label="Amount" className="form-control" buttonClassName="btn btn-primary" showOperator shown/>
                        <SelectFilter<MyData> field="color" label="Colors" options={colorOptions} styles={customStyles} isMulti />
                        <DateFilter field="birthday" label="Birthday" buttonClassName="btn btn-primary" showOperator/>
                    </FilterBar>
                    <div className="mt-2">
                        <button onClick={this.runFilters} className="btn btn-primary" disabled={filterApplied}>Run Filters</button>
                    </div>
                </div>

                <div>
                    <DataTable items={this.state.display}>
                        <BoundColumn<MyData> binding={item => item.firstName} headerText="First Name" className="col-3 col-md-2" />
                        <BoundColumn<MyData> binding={item => item.lastName} headerText="Last Name" className="col-3 col-md-2" />
                        <BoundColumn<MyData> binding={item => item.amount.toString()} headerText="Amount" className="col-3 col-md-1" />
                        <BoundColumn<MyData> binding={item => item.color} headerText="Color" className="col-3 col-md-2" />
                        <BoundColumn<MyData> binding={item => item.birthday} headerText="Birthday" className="col-4 col-md-2" formatter={value => moment(value).format('L')} />
                        <BoundColumn<MyData> binding={item => item.comment} headerText="Comment" className="col-12 col-md-3" />
                    </DataTable>
                </div>
            </section>
        );
    }
}
