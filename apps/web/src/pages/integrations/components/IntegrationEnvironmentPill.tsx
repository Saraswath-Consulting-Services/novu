import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { colors } from '../../../design-system';

const EnvironmentPillHolder = styled.div`
  width: fit-content;
  display: flex;
  align-items: flex-end;
  gap: 8px;
  background-color: ${({ theme }) => (theme.colorScheme === 'dark' ? colors.B30 : colors.B85)};
  border-radius: 16px;
  padding: 6px 8px;
`;

const EnvironmentName = styled.span`
  color: ${({ theme }) => (theme.colorScheme === 'dark' ? colors.B80 : colors.B40)};
  font-size: 14px;
`;

const EnvironmentIcon = styled(FontAwesomeIcon)`
  font-size: 16px;
  color: ${({ theme }) => (theme.colorScheme === 'dark' ? colors.B60 : colors.B40)};
`;

export const IntegrationEnvironmentPill = ({ name, testId }: { name: string; testId?: string }) => {
  return (
    <EnvironmentPillHolder data-test-id={testId}>
      <EnvironmentIcon icon={name.toLowerCase() === 'production' ? 'rocket' : 'tools'} />
      <EnvironmentName>{name}</EnvironmentName>
    </EnvironmentPillHolder>
  );
};
