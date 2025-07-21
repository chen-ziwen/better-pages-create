interface AdminDetailProps {
  params: { id: string }
}

export default function AdminDetailPage({ params }: AdminDetailProps) {
  return (
    <div>
      <h1>管理员详情</h1>
      <p>
        管理员ID:
        {params.id}
      </p>
    </div>
  )
}
