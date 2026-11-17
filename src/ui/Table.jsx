import PropTypes from "prop-types";
import { createContext, useContext } from "react";
import styled from "styled-components";

// 1. Styled Components

const StyledTable = styled.div`
  border: 1px solid var(--color-grey-200);
  font-size: 1.4rem;
  background-color: var(--color-grey-0);
  border-radius: 7px;
  overflow: hidden;
`;

const CommonRow = styled.div`
  display: grid;
  grid-template-columns: ${(props) => props.$columns};
  column-gap: 2.4rem;
  align-items: center;
`;

const StyledHeader = styled(CommonRow)`
  padding: 1.6rem 2.4rem;
  background-color: var(--color-grey-50);
  border-bottom: 1px solid var(--color-grey-100);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  font-weight: 600;
  color: var(--color-grey-600);
`;

const StyledBody = styled.section`
  margin: 0.4rem 0;
`;

const StyledRow = styled(CommonRow)`
  padding: 1.2rem 2.4rem;

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }
`;

const StyledFooter = styled.footer`
  background-color: var(--color-grey-50);
  display: flex;
  justify-content: center;
  padding: 1.2rem;

  &:not(:has(*)) {
    display: none;
  }
`;

const Empty = styled.p`
  font-size: 1.6rem;
  font-weight: 500;
  text-align: center;
  margin: 2.4rem;
`;

// 2. Context

const TableContext = createContext(null);

// 3. Parent Component

function Table({ columns, children }) {
  return (
    <TableContext.Provider value={{ columns }}>
      <StyledTable role="table">{children}</StyledTable>
    </TableContext.Provider>
  );
}

// 4. Custom hook

function useTable() {
  const context = useContext(TableContext);

  if (!context) {
    throw new Error("Table components must be used within Table");
  }

  return context;
}

// 5. Header Component

function Header({ children }) {
  const { columns } = useTable();

  return (
    <StyledHeader role="row" $columns={columns}>
      {children}
    </StyledHeader>
  );
}

// 6. Row Component

function Row({ children }) {
  const { columns } = useTable();

  return (
    <StyledRow role="row" $columns={columns}>
      {children}
    </StyledRow>
  );
}

// 7. Body Component

function Body({ data, render }) {
  if (!data.length) {
    return <Empty>There are no items right now.</Empty>;
  }

  return <StyledBody role="rowgroup">{data.map(render)}</StyledBody>;
}

// 8. Footer Component

function Footer({ children }) {
  return <StyledFooter>{children}</StyledFooter>;
}

// 9. Compound Components

Table.Header = Header;
Table.Body = Body;
Table.Row = Row;
Table.Footer = Footer;

// 10. PropTypes

Table.propTypes = {
  columns: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

Header.propTypes = {
  children: PropTypes.node.isRequired,
};

Row.propTypes = {
  children: PropTypes.node.isRequired,
};

Body.propTypes = {
  data: PropTypes.array.isRequired,
  render: PropTypes.func.isRequired,
};

Footer.propTypes = {
  children: PropTypes.node,
};

export default Table;
