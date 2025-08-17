export default function PrivacyPolicyPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="prose max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">プライバシーポリシー</h1>

        <p className="text-sm text-gray-600 mb-8">当サイトのプライバシーポリシーは以下の通りです。</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold border-b pb-2 mb-4">個人情報の取得</h2>
          <p>
            当サイトでは、Googleが提供している分析ツール「Google
            Analytics」を利用して、訪問者の行動を分析しています。このGoogle
            Analyticsはトラフィックデータの収集のためにCookieを使用しています。このトラフィックデータは匿名で収集されており、個人を特定するものではありません。この機能はCookieを無効にすることで収集を拒否することが出来ますので、お使いのブラウザの設定をご確認ください。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold border-b pb-2 mb-4">個人情報の利用</h2>
          <p>
            当サイトでは、メールでのお問い合わせの際に、名前（ハンドルネーム）、メールアドレス等の個人情報をご登録いただく場合がございます。これらの個人情報は、質問に対する回答や必要な情報を電子メール等でご連絡する場合に利用させていただくものです。個人情報をご提供いただく際の目的以外では利用いたしません。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold border-b pb-2 mb-4">個人情報の保管</h2>
          <p>
            お客さまの個人情報を正確かつ最新の状態に保ち、個人情報への不正アクセス・紛失・破損・改ざん・漏洩などを防止するため、セキュリティシステムの維持等の必要な措置を講じ、安全対策を実施し個人情報の厳重な管理を行ないます。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold border-b pb-2 mb-4">個人情報の第三者への開示</h2>
          <p className="mb-4">
            次の場合を除いて、お客様からいただいた個人情報を、第三者に開示することはありません。
          </p>
          <ul className="list-disc list-inside bg-gray-50 p-4 rounded-md">
            <li>提供者の同意がある場合</li>
            <li>法令に基づく場合</li>
            <li>不正行為やその他の違法行為を防ぐために個人情報の開示が必要となった場合</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold border-b pb-2 mb-4">個人情報のお客様への開示</h2>
          <p>
            お客さまがご本人の個人情報の照会・修正・削除などをご希望される場合には、ご本人であることを確認の上、対応させていただきます。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold border-b pb-2 mb-4">広告の配信について</h2>
          <p>
            当サイトは第三者配信の広告サービス「Google Adsense
            グーグルアドセンス」を利用しています。広告配信事業者は、ユーザーの興味に応じた広告を表示するためにCookie（クッキー）を使用することがあります。Cookie（クッキー）を無効にする設定およびGoogleアドセンスに関する詳細は「広告
            – ポリシーと規約 – Google」をご覧ください。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold border-b pb-2 mb-4">免責事項</h2>
          <p>
            当サイトで掲載している画像の著作権・肖像権等は各権利所有者に帰属致します。記事の内容や掲載画像等に問題がございましたら、各権利所有者様本人が直接メールでご連絡下さい。確認後、対応させて頂きます。当サイトからリンクやバナーなどによって他のサイトに移動された場合、移動先サイトで提供される情報、サービス等について一切の責任を負いません。当サイトのコンテンツ・情報につきまして、可能な限り正確な情報を掲載するよう努めておりますが、誤情報が入り込んだり、情報が古くなっていることもございます。当サイトに掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold border-b pb-2 mb-4">著作権について</h2>
          <p>
            当サイトに掲載されている情報についての著作権は放棄しておりません。当サイト記事からの引用に関しましては「引用元の明示」によって無償で引用頂けます。ただし、全文転載はお断りいたしております。引用許可範囲についても、事前予告なくこれを変更する事があります。また、当サイトのRSSを利用し、コンテンツをそのまま盗用することも禁止しています。
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold border-b pb-2 mb-4">プライバシーポリシーの変更について</h2>
          <p>
            当サイトは、個人情報に関して適用される日本の法令を遵守するとともに、本ポリシーの内容を適宜見直しその改善に努めます。修正された最新のプライバシーポリシーは常に本ページにて開示されます。
          </p>
        </section>
      </div>
    </main>
  );
}
