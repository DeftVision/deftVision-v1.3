import { Box } from "@mui/material";
import { ScoreChart, Ranking, ShopperScore } from '../dashboards/index'

const scores = [
    { type: 'foodScore', label: 'Food Score' },
    { type: 'serviceScore', label: 'Service Score' },
    { type: 'cleanScore', label: 'Cleanliness Score' },
    { type: 'finalScore', label: 'Final Score' },

]



export default function Dashboards () {
    return (
        <>
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap', // Allows wrapping to the next row
                justifyContent: 'center', // Center horizontally
                gap: 4, // Adds spacing between items
                padding: 4,
            }}
        >
            {scores.map((score) => (
                <Box
                    key={score.type}
                    sx={{
                        flex: '1 1 calc(25% - 16px)', // Quarter width with spacing adjustment
                        maxWidth: 'calc(25% - 16px)',
                        '@media (max-width: 960px)': {
                            flex: '1 1 calc(50% - 16px)', // Half width on medium screens
                            maxWidth: 'calc(50% - 16px)',
                        },
                        '@media (max-width: 600px)': {
                            flex: '1 1 100%', // Full width on small screens
                            maxWidth: '100%',
                        },
                    }}
                >
                    <ScoreChart scoreType={score.type} label={score.label} />
                </Box>
            ))}
        </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap', // Allows wrapping to the next row
                    justifyContent: 'center', // Center horizontally
                    gap: 4, // Adds spacing between items
                    padding: 4,
                }}
            >
                <ShopperScore />
            </Box>
    </>
    );
}