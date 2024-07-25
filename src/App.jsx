
import { useEffect, useRef, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component';
import styled from 'styled-components'
import { useVirtualizer } from '@tanstack/react-virtual'

const StyledOutterDiv = styled.div`
  width: 500px;
  height: 600px;
  border: 1px solid black;
  overflow: auto;
  &::-webkit-scrollbar{
    display: none;
  }
`

const ListItem = styled.div`
  height: 200px;
  width: 100%;
  border: 1px solid grey;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const App = () => {
  const parentRef = useRef();

  const [listData, setListData] = useState([]);
  const [currentFetchedData, setCurrentFetcheddata] = useState();

  const rowVirtualizer = useVirtualizer({
    count: listData?.length + 1 || 1000,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    // this one is needed for avoiding shaking issue
    overscan: 5
  })

  const rowVirtualizerItems = rowVirtualizer?.getVirtualItems();

  const fetchData = async (pagenumber) => {
    try {
      const res = await fetch(`https://reqres.in/api/users?page=${pagenumber}`);
      const data = await res.json()
      setCurrentFetcheddata(data)
      setListData(prev => [...prev, ...data.data]);
    } catch (error) {
      alert("failed to fetchData")
    }
  }

  useEffect(() => {
    fetchData(1);
  }, [])

  return (
    <StyledOutterDiv id="scroll-target" ref={parentRef}>
      <InfiniteScroll
        style={{ height: '100%', width: '100%' }}
        dataLength={listData?.length || 0}
        next={() => fetchData(currentFetchedData?.page + 1)}
        hasMore={currentFetchedData?.page < currentFetchedData?.total_pages}
        loader={<div>Loading Data...</div>}
        endMessage={<div>end....</div>}
        scrollableTarget="scroll-target"
      >
        {
          rowVirtualizerItems?.map((virtualRow) => {
            const user = listData[virtualRow.index];

            if (!user) return ;
            return (
              <ListItem
                key={virtualRow.index}
                ref={virtualRow.measureElement}
              >
                <h1>{user.id}</h1>
                <p>{`full name: ${user.first_name} ${user.last_name}`}</p>
              </ListItem>
            )
          } 
        )}
      </InfiniteScroll>
    </StyledOutterDiv>
  )
}

export default App
