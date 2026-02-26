import { FC } from 'react';

interface HeaderProps {
  lectureHeader: HeaderType;
}

export const Header: FC<HeaderProps> = ({ lectureHeader }) => (
  <>
    <h1>{lectureHeader}</h1>
  </>
);

