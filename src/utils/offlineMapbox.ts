import {offlineManager, StyleURL} from '@rnmapbox/maps';

const progressListener = (region: any, status: { percentage: number; }) => {
    console.log(`Downloadprogressie: ${status.percentage.toFixed(2)}%`);
};

const errorListener = (region: any, err: any) => {
    console.error('Fout bij downloaden:', err);
};

export const downloadTMBMap = async (
    setProgress: (value: number) => void,
    onComplete?: () => void,
    onError?: (err: unknown) => void
) => {
    const bounds: [[number, number], [number, number]] = [
        [6.6753, 45.6889], // Zuidwest (min lon, min lat)
        [7.1631, 46.1158], // Noordoost (max lon, max lat)
    ];

    try {
        const existing = await offlineManager.getPack('tmb-offline');
        if (existing) {
            await offlineManager.deletePack('tmb-offline');
        }
        await offlineManager.resetDatabase();
    } catch (e) {
        console.error('Fout bij voorbereiding download:', e);
    }


    try {
        await offlineManager.createPack(
            {
                name: 'tmb-offline',
                styleURL: "mapbox://styles/yensb/cmafr3ohl00v601skf107bsla",
                minZoom: 10,
                maxZoom: 22,
                bounds,
                metadata: { trail: 'TMB' },
            },
            (region, status) => {
                const percent = parseFloat(status.percentage.toFixed(1));
                setProgress(percent);
                if (percent >= 100 && onComplete) onComplete();
            },
            (region, err) => {
                console.error('Download fout:', err);
                if (onError) onError(err);
            }
        );
    } catch (e) {
        console.error('Pack maken fout:', e);
        if (onError) onError(e);
    }
};


export const deleteOfflinePack = async (name: string = 'tmb-offline') => {
    try {
        const packs = await offlineManager.getPacks();
        const existing = packs.find(p => p.name === name);
        if (existing) {
            await offlineManager.deletePack(name);
            console.log(`✅ Offline pack '${name}' deleted.`);
        } else {
            console.log(`ℹ️ No offline pack found with name: ${name}`);
        }
    } catch (err) {
        console.error('❌ Error when deleting pack:', err);
    }
};