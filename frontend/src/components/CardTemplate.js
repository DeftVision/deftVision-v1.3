import { Box, Card, CardHeader, CardContent, Avatar, Typography } from '@mui/material';


export default function CardTemplate({
    title,
    subtitle,
    avatar,
    icon,
    content,
    onClick,
    hoverEffect = true,
}) {
    return (
        <Card
            sx={{
                width: { xs: '100%', sm: 300 },
                height: 'auto',
                position: 'relative',
                borderRadius: 2,
                boxShadow: 3,
                overflow: 'hidden',
                transition: hoverEffect ? 'transform 0.3s, box-shadow: 0.3s' : undefined,
                '&:hover': hoverEffect ? {
                    transform: 'scale(1.05)',
                    boxShadow: 6,
                }
                : undefined,
                cursor: onClick ? 'pointer' : 'default',
            }}
            onClick={onClick}
        >
            <CardHeader
                avatar={avatar}
                title={
                    <Typography
                        variant='h6'
                        sx={{
                            position: 'relative',
                            zIndex: 2,
                        }}
                    >
                        {title}
                    </Typography>
                }
                subheader={
                    subtitle && (
                        <Typography
                            variant='body2'
                            color='textSecondary'
                            sx={{
                                position: 'relative',
                                zIndex: 2,
                            }}
                            >
                            {subtitle}
                        </Typography>
                    )
                }
                subheader={
                subtitle && (
                    <Typography variant='body2' color='textSecondary'>
                        {subtitle}
                    </Typography>
                    )
                }
            />
            <CardContent sx={{ zIndex: icon ? 2 : undefined }}>{content}</CardContent>
        </Card>
    );
}