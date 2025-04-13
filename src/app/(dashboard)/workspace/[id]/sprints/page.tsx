const WorkspaceSprints = async ({ params }: { params: Promise<{ id: string }> }) => {
  const getParams = await params

  return <>WS SPRINTS {getParams?.id}</>
}

export default WorkspaceSprints
