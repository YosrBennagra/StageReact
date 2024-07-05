import React from 'react'

import DragAndDropTable from './DragAndDropTable'
import DraggableItem from './DraggableItem'


export default function MySchedule() {
    return (
        <>
            <DragAndDropTable />
            <DraggableItem item={{ title: 'Math', color: 'default' }} />

        </>
    )
}
