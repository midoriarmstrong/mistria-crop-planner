import { Box } from '@mui/material';

interface IconImageProps extends React.PropsWithChildren {
  icon?: string;
  name: string;
}

export function IconImage({ children, icon = '', name }: IconImageProps) {
  return (
    <Box className="text-with-icon">
      <img width={20} height={20} src={icon} alt={`${name} Icon`} />
      {children}
    </Box>
  );
}
