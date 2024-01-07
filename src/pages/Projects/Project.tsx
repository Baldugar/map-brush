import { ChevronLeft } from '@mui/icons-material'
import { Box, IconButton, Stack, Typography } from '@mui/material'
import * as d3 from 'd3'
import { useContext, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ProjectsContext } from '../../context/ProjectContext'
import { getShadowCardDOMRect } from '../../utils/func/project'

const Project = () => {
    const projectsContext = useContext(ProjectsContext)
    const params = useParams()
    const projectID = params.projectID
    const navigate = useNavigate()
    const mapRef = useRef(null)

    if (!projectsContext) {
        throw new Error('You probably forgot to put <ProjectsProvider>.')
    }
    const { projects } = projectsContext
    const project = projects.find((project) => project.id === projectID)
    if (!project) {
        throw new Error(`Project with id ${projectID} not found.`)
    }

    document.getElementById('root')!.style.height = '100%'

    useEffect(() => {
        // Asegúrate de que el contenedor esté listo
        if (mapRef.current) {
            const svg = d3.select(mapRef.current).append('svg').attr('width', '100%').attr('height', '100%')

            const nodes = svg
                .selectAll('g.node')
                .data(project.nodes)
                .enter()
                .append('g')
                .classed('node', true)
                .attr('transform', (d) => `translate(${d.x},${d.y})`)

            nodes.each(function (d) {
                const node = d3.select(this)

                const shadowCardSize = getShadowCardDOMRect(d)
                if (!shadowCardSize) {
                    return
                }

                const { width, height } = shadowCardSize

                // Agrega el rectángulo con las dimensiones calculadas
                node.append('rect')
                    .attr('width', width)
                    .attr('height', height)
                    .attr('x', -width / 2)
                    .attr('y', -height / 2)
                    .style('fill', 'white')
                    .style('stroke', 'black')

                // Agrega el texto alineado en el centro
                node.append('text')
                    .text(d.name)
                    .attr('x', 0)
                    .attr('y', height / 2) // Alineación vertical en el centro
                    .attr('text-anchor', 'middle')
                    .attr('dominant-baseline', 'middle')

                // Agrega los círculos de ancla en cada lado del rectángulo
                const anchorRadius = 4 // El radio de los círculos de ancla

                // Ancla superior
                node.append('circle')
                    .attr('cx', 0)
                    .attr('cy', -height / 2)
                    .attr('r', anchorRadius)
                    .style('fill', 'gray')

                // Ancla derecha
                node.append('circle')
                    .attr('cx', width / 2)
                    .attr('cy', 0)
                    .attr('r', anchorRadius)
                    .style('fill', 'gray')

                // Ancla inferior
                node.append('circle')
                    .attr('cx', 0)
                    .attr('cy', height / 2)
                    .attr('r', anchorRadius)
                    .style('fill', 'gray')

                // Ancla izquierda
                node.append('circle')
                    .attr('cx', -width / 2)
                    .attr('cy', 0)
                    .attr('r', anchorRadius)
                    .style('fill', 'gray')
            })
        }

        const refToClean = mapRef.current

        // Función de limpieza para desmontar
        return () => {
            if (refToClean) {
                d3.select(refToClean).selectAll('*').remove()
            }
        }
    }, [projectID, project.nodes])

    return (
        <Box display={'flex'} flexDirection={'column'} height={'100%'} gap={3} padding={2}>
            <Box display={'flex'} gap={3} alignItems={'center'}>
                <IconButton onClick={() => navigate(-1)}>
                    <ChevronLeft
                        sx={{
                            fontSize: '2rem',
                        }}
                    />
                </IconButton>
                <Stack>
                    <Typography variant={'h5'}>{project.name}</Typography>
                    <Typography variant={'h6'}>{project.description}</Typography>
                </Stack>
            </Box>
            <Box height={'100%'} bgcolor={'#00FFFF30'}>
                <Box
                    id={'center'}
                    position={'absolute'}
                    width={2}
                    height={2}
                    borderRadius={'50%'}
                    top={'calc(50% - 1px)'}
                    left={'calc(50% - 1px)'}
                    sx={{
                        backgroundColor: 'red',
                        zIndex: 50,
                    }}
                />
                <div id={'map'} ref={mapRef} style={{ height: '100%' }} />
            </Box>
        </Box>
    )
}

export default Project
