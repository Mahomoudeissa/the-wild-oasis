import styled from "styled-components";

// استخدمنا عنصر HTML عادي <header> أو Styled Component باسم مختلف تماماً
const StyledHeader = styled.header`
  background-color: var(--color-grey-0);
  padding: 1.2rem 4.8rem;
  border-bottom: 1px solid var(--color-grey-100);
`;

function Header() {
  return <StyledHeader>Header</StyledHeader>;
}

export default Header;
