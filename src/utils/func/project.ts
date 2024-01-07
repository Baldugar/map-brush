import { ProjectNodeType } from '../../types/project_types'

export const capitalizeExpertiseArea = (expertiseArea: string) => {
    if (expertiseArea.length > 2) {
        return expertiseArea[0].toUpperCase() + expertiseArea.slice(1)
    }
    return expertiseArea.toUpperCase()
}

export const getShadowCardDOMRect = (nodeDialogData: ProjectNodeType) => {
    const card = document.createElement('div')
    card.style.position = 'absolute'
    card.style.zIndex = '2000'
    card.innerHTML = `
        <div class="MuiBox-root" style="width: fit-content; max-width: 800px">
            <div id="toRender" class="
                MuiPaper-root 
                MuiPaper-elevation 
                MuiPaper-rounded 
                MuiPaper-elevation1 
                MuiCard-root 
                css-bj2p8a-MuiPaper-root-MuiCard-root"
                >
                <div class="
                    MuiCardHeader-root 
                    css-185gdzj-MuiCardHeader-root"
                    >
                    <div class="
                        MuiCardHeader-content 
                        css-1qbkelo-MuiCardHeader-content"
                        >
                        <span class="
                            MuiTypography-root 
                            MuiTypography-h5 
                            MuiCardHeader-title 
                            css-1qvr50w-MuiTypography-root"
                            >
                            ${nodeDialogData.name}
                        </span>
                        <span class="
                            MuiTypography-root 
                            MuiTypography-body1 
                            MuiCardHeader-subheader 
                            css-1k9zmmr-MuiTypography-root"
                            >
                            ${nodeDialogData.description} 
                        </span>
                    </div>
                </div>
                <div class="
                    MuiCardContent-root 
                    css-46bh2p-MuiCardContent-root"
                    >
                    <div class="
                        MuiGrid-root 
                        MuiGrid-container 
                        MuiGrid-spacing-xs-2 
                        css-mhc70k-MuiGrid-root"
                        >
                        ${Object.entries(nodeDialogData.expertiseAreas)
                            .filter(([_, v]) => v)
                            .map(
                                ([k, _]) =>
                                    `<div class="
                                        MuiGrid-root 
                                        MuiGrid-item 
                                        css-13i4rnv-MuiGrid-root"
                                        >
                                        <div class="
                                            MuiChip-root 
                                            MuiChip-filled 
                                            MuiChip-sizeMedium 
                                            MuiChip-colorDefault 
                                            MuiChip-filledDefault 
                                            css-1rokx5o-MuiChip-root"
                                            >
                                            <span class="
                                                MuiChip-label 
                                                MuiChip-labelMedium 
                                                css-6od3lo-MuiChip-label"
                                                >
                                                ${k}
                                            </span>
                                        </div>
                                    </div>`,
                            )}
                    </div>
                </div>
            </div>
        </div>
    `

    document.body.appendChild(card)
    const toRender = document.getElementById('toRender')
    const cardSize = toRender?.getBoundingClientRect()
    console.log('cardSize', cardSize, nodeDialogData.name)
    document.body.removeChild(card)
    return cardSize
}
