import { Box } from "@mui/material";
import { Ranking, ScoreChart, ShopperScore } from '../dashboards/index';

const scores = [
    { type: 'foodScore', label: 'Food Score' },
    { type: 'serviceScore', label: 'Service Score' },
    { type: 'cleanScore', label: 'Cleanliness Score' },
    { type: 'finalScore', label: 'Final Score' },
];

export default function Dashboards() {
    return (
        <Box>
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: 2, // Reduce the gap between circles
                    padding: 4,
                    rowGap: 2, // Specifically reduce vertical spacing between rows
                }}
            >
                {scores.map((score) => (
                    <Box
                        key={score.type}
                        sx={{
                            flex: '1 1 calc(25% - 16px)', // Ensures even distribution
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
            <Box sx={{ marginTop: 4 }}>
                <Ranking />
            </Box>
            <Box>
                <ShopperScore />
            </Box>
        </Box>
    );
}
