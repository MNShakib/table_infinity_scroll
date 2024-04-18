import { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import data from './assets/collegeData.json';
import './App.css';

function App() {
  const [dataSource, setDataSource] = useState([]);
  const [hasMore, setHashMore] = useState(true);
  const [ind, setInd] = useState(0);
  const [searchData, setSearchData] = useState([]);
  const [showFilterData, setShowFilterData] = useState(true);

  useEffect(() => {
    setDataSource(data.slice(0, 5));
  }, []);

  const fetchMoreData = () => {
    setInd((prev) => prev + 5);
    console.log(`i=${ind} dl=${data.length}`);
    if (ind + 5 >= data.length) {
      setHashMore(false);
    } else {
      setDataSource([...dataSource, ...data.slice(ind, ind + 5)]);
    }
  };

  const sortHandler = (key, isAscending) => {
    setDataSource((prev) => {
      const copy = structuredClone(prev);
      if (key === 'fees' && isAscending) {
        copy.sort((a, b) => (a.fees < b.fees ? -1 : a.fees > b.fees ? 1 : 0));
      } else if (key === 'fees' && !isAscending) {
        copy.sort((a, b) => (a.fees > b.fees ? -1 : a.fees < b.fees ? 1 : 0));
      }
      if (key === 'review' && isAscending) {
        copy.sort((a, b) =>
          a.review_details.review < b.review_details.review
            ? -1
            : a.review_details.review > b.review_details.review
            ? 1
            : 0
        );
      } else if (key === 'review' && !isAscending) {
        copy.sort((a, b) =>
          a.review_details.review > b.review_details.review
            ? -1
            : a.review_details.review < b.review_details.review
            ? 1
            : 0
        );
      }
      return copy;
    });
  };
  const searchHandler = (e) => {
    e.preventDefault();
    if (e.target.value === "") {
      setSearchData([]);
      setShowFilterData(true);
      return;
    }
    const filterData = dataSource.filter((d, ind) => {
      const dValue = d.college.name.toLowerCase();
      return dValue.includes(e.target.value.toLowerCase());
    });
    console.log("filtered Data=", filterData);
    setShowFilterData(false);
    setSearchData([...filterData]);
    // dataSource.filter((data) => data.college.name.contains(e.target.value));
  };

  return (
    <div id='mainDiv'>
      <div className='search'>
        <input type='text' onChange={searchHandler} />
        <div>{searchData.length>0 && "Searched Data and Please clear search to view colleges"}</div>
      </div>
      {
        !showFilterData && (
          searchData.length > 0 ?
            <table id='table'>
              {searchData.map((data, index) => {
                return (
                  <>
                    {index == 0 ? (
                      <tr>
                        <th>CD Rank</th>
                        <th>Colleges</th>
                        <th>
                          Course Fees{' '}
                          <span
                            className='sort'
                            onClick={() => sortHandler('fees', true)}
                          >
                            &nbsp;&nbsp; ↑
                          </span>{' '}
                          <span
                            className='sort'
                            onClick={() => sortHandler('fees', false)}
                          >
                            &nbsp; &nbsp;↓
                          </span>
                        </th>
                        <th>Placement </th>
                        <th>
                          User Reviews{' '}
                          <span
                            className='sort'
                            onClick={() => sortHandler('review', true)}
                          >
                            &nbsp;&nbsp;↑
                          </span>{' '}
                          <span
                            className='sort'
                            onClick={() => sortHandler('review', false)}
                          >
                            &nbsp;&nbsp; ↓
                          </span>
                        </th>
                        <th>Rank</th>
                      </tr>
                    ) : null}
                    <tr key={index + 'X' + data.college.name}>
                      <td>&nbsp;&nbsp; #{index + 1}</td>
                      <td id='clg'>
                        {data.college.isFeatured == 'true' ? (
                          <div id='featured'>Featured</div>
                        ) : (
                          ''
                        )}
                        <div id='clgName'>{data.college.name}</div>
                        <div id='loc'>
                          {data.college.location} | {data.college.approved}
                        </div>
                        {data.college.courses != '' ? (
                          <div id='details'>
                            <div>{data.college.courses}</div>
                            <span>{data.college.exam}</span>
                          </div>
                        ) : (
                          ''
                        )}
                        <div id='content'>
                          <span id='orange'>ApplyNow</span>
                          <span id='teal'>Download Brochure</span>
                          <span id='grey'>Add To Compare</span>
                        </div>
                      </td>
                      <td>
                        <div id='fees'>
                          <div id='teal'>₹ {data.fees}</div>
                          <div id='be'>B.E/B.Tech</div>
                          <div id='be'>-1st Year Fees</div>
                          <div id='orange'>Compare Fees</div>
                        </div>
                      </td>
                      <td>
                        <div id='fees'>
                          <div id='teal'>₹ {data.placement.average}</div>
                          <div id='be'>Average Package</div>
                          <div id='teal'>₹ {data.placement.highest}</div>
                          <div id='be'>Highest Package</div>
                          <div id='orange'>Compare Placement</div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div id='ratings'>{data.review_details.review}/10</div>
                          <div id='be'>
                            Based on {data.review_details.number_of_reviews} User
                          </div>
                          <div id='be'>Reviews</div>
                          <div id='best'>
                            &nbsp;&nbsp;&nbsp; Best in {data.review_details.best_in}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div id='grey'>
                            #{data.ranking_details.rank}/
                            <span id='orange'>{data.ranking_details.out_of}</span> in
                            India
                          </div>
                          <div id='grey'>
                            {data.ranking_details.given_by} &nbsp; 2023
                          </div>
                        </div>
                      </td>
                    </tr>
                  </>
                );
              })}
            </table> :
            "No Search Data"
        )
      }
        {showFilterData && <table id='table'>
        <InfiniteScroll
          style={{ width: '100vw' }}
            dataLength={dataSource.length}
            next={fetchMoreData}
            hasMore={hasMore}
            endMessage='All Data has been fetched'
          >
            {dataSource.map((data, index) => {
              return (
                <>
                  {index == 0 ? (
                    <tr>
                      <th>CD Rank</th>
                      <th>Colleges</th>
                      <th>
                        Course Fees{' '}
                        <span
                          className='sort'
                          onClick={() => sortHandler('fees', true)}
                        >
                          &nbsp;&nbsp; ↑
                        </span>{' '}
                        <span
                          className='sort'
                          onClick={() => sortHandler('fees', false)}
                        >
                          &nbsp; &nbsp;↓
                        </span>
                      </th>
                      <th>Placement </th>
                      <th>
                        User Reviews{' '}
                        <span
                          className='sort'
                          onClick={() => sortHandler('review', true)}
                        >
                          &nbsp;&nbsp;↑
                        </span>{' '}
                        <span
                          className='sort'
                          onClick={() => sortHandler('review', false)}
                        >
                          &nbsp;&nbsp; ↓
                        </span>
                      </th>
                      <th>Rank</th>
                    </tr>
                  ) : null}
                  <tr key={index + 'X' + data.college.name}>
                    <td>&nbsp;&nbsp; #{index + 1}</td>
                    <td id='clg'>
                      {data.college.isFeatured == 'true' ? (
                        <div id='featured'>Featured</div>
                      ) : (
                        ''
                      )}
                      <div id='clgName'>{data.college.name}</div>
                      <div id='loc'>
                        {data.college.location} | {data.college.approved}
                      </div>
                      {data.college.courses != '' ? (
                        <div id='details'>
                          <div>{data.college.courses}</div>
                          <span>{data.college.exam}</span>
                        </div>
                      ) : (
                        ''
                      )}
                      <div id='content'>
                        <span id='orange'>ApplyNow</span>
                        <span id='teal'>Download Brochure</span>
                        <span id='grey'>Add To Compare</span>
                      </div>
                    </td>
                    <td>
                      <div id='fees'>
                        <div id='teal'>₹ {data.fees}</div>
                        <div id='be'>B.E/B.Tech</div>
                        <div id='be'>-1st Year Fees</div>
                        <div id='orange'>Compare Fees</div>
                      </div>
                    </td>
                    <td>
                      <div id='fees'>
                        <div id='teal'>₹ {data.placement.average}</div>
                        <div id='be'>Average Package</div>
                        <div id='teal'>₹ {data.placement.highest}</div>
                        <div id='be'>Highest Package</div>
                        <div id='orange'>Compare Placement</div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div id='ratings'>{data.review_details.review}/10</div>
                        <div id='be'>
                          Based on {data.review_details.number_of_reviews} User
                        </div>
                        <div id='be'>Reviews</div>
                        <div id='best'>
                          &nbsp;&nbsp;&nbsp; Best in {data.review_details.best_in}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div id='grey'>
                          #{data.ranking_details.rank}/
                          <span id='orange'>{data.ranking_details.out_of}</span>{' '}
                          in India
                        </div>
                        <div id='grey'>
                          {data.ranking_details.given_by} &nbsp; 2023
                        </div>
                      </div>
                    </td>
                  </tr>
                </>
              );
            })}
          </InfiniteScroll>
        </table>}
    </div>
  );
}

export default App;
