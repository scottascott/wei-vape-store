import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateStoreInfo } from "@/server/actions/store-info.actions";
import { storeInfoService } from "@/server/services/store-info.service";

const DAYS = [
  { key: "mon", label: "Monday" },
  { key: "tue", label: "Tuesday" },
  { key: "wed", label: "Wednesday" },
  { key: "thu", label: "Thursday" },
  { key: "fri", label: "Friday" },
  { key: "sat", label: "Saturday" },
  { key: "sun", label: "Sunday" },
] as const;

export default async function AdminStoreInfoPage() {
  const storeInfo = await storeInfoService.get();
  const hours = (storeInfo?.hours ?? {}) as Record<string, string | undefined>;
  const socialLinks = (storeInfo?.socialLinks ?? {}) as Record<string, string | undefined>;

  return (
    <div>
      <h1 className="text-xl font-semibold">Store Info</h1>

      <form action={updateStoreInfo} className="mt-6 flex max-w-lg flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Store name</Label>
            <Input id="name" name="name" defaultValue={storeInfo?.name} required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="addressLine">Address</Label>
            <Input id="addressLine" name="addressLine" defaultValue={storeInfo?.addressLine} required />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" defaultValue={storeInfo?.city} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="state">State</Label>
              <Input id="state" name="state" defaultValue={storeInfo?.state} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="zip">ZIP</Label>
              <Input id="zip" name="zip" defaultValue={storeInfo?.zip} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" defaultValue={storeInfo?.phone} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" defaultValue={storeInfo?.email ?? ""} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="mapEmbedUrl">Map embed URL</Label>
            <Input
              id="mapEmbedUrl"
              name="mapEmbedUrl"
              defaultValue={storeInfo?.mapEmbedUrl ?? ""}
              placeholder="https://www.google.com/maps/embed?..."
            />
          </div>
        </div>

        <div>
          <p className="text-sm font-medium">Hours</p>
          <div className="mt-2 grid grid-cols-2 gap-3">
            {DAYS.map((day) => (
              <div key={day.key} className="flex flex-col gap-1.5">
                <Label htmlFor={day.key}>{day.label}</Label>
                <Input
                  id={day.key}
                  name={day.key}
                  defaultValue={hours[day.key] ?? ""}
                  placeholder="10:00-20:00"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium">Social links</p>
          <div className="mt-2 flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="instagram">Instagram</Label>
              <Input id="instagram" name="instagram" defaultValue={socialLinks.instagram ?? ""} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="facebook">Facebook</Label>
              <Input id="facebook" name="facebook" defaultValue={socialLinks.facebook ?? ""} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="twitter">Twitter</Label>
              <Input id="twitter" name="twitter" defaultValue={socialLinks.twitter ?? ""} />
            </div>
          </div>
        </div>

        <Button type="submit" className="self-start">
          Save store info
        </Button>
      </form>
    </div>
  );
}
