import { Box, type SxProps } from '@mui/material';

interface IconImageProps extends React.PropsWithChildren {
  icon?: string;
  name: string;
  style?: SxProps;
}

export function IconImage({
  children,
  icon = '',
  name,
  style,
}: IconImageProps) {
  return (
    <Box className="text-with-icon" sx={style}>
      <img width={20} height={20} src={icon} alt={`${name} Icon`} />
      {children}
    </Box>
  );
}
